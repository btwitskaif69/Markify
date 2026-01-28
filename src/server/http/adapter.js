import { NextResponse } from "next/server";
import { applyWaf } from "../middleware/wafMiddleware";
import { applyRateLimit } from "../middleware/rateLimitMiddleware";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const parseQuery = (searchParams) => {
  const query = {};
  for (const [key, value] of searchParams.entries()) {
    if (query[key] === undefined) {
      query[key] = value;
    } else if (Array.isArray(query[key])) {
      query[key].push(value);
    } else {
      query[key] = [query[key], value];
    }
  }
  return query;
};

const parseBody = async (request) => {
  if (request.method === "GET" || request.method === "HEAD") return {};

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await request.json();
    } catch (error) {
      return {};
    }
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    try {
      const formData = await request.formData();
      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      return data;
    } catch (error) {
      return {};
    }
  }

  try {
    const text = await request.text();
    return text ? { raw: text } : {};
  } catch (error) {
    return {};
  }
};

const getRequestIp = (request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.ip ||
    "127.0.0.1"
  );
};

const createResponseAdapter = () => {
  let statusCode = 200;
  let body;
  let isJson = true;
  const headers = new Headers();

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      body = payload;
      isJson = true;
      return this;
    },
    send(payload) {
      body = payload ?? null;
      isJson = false;
      return this;
    },
    set(name, value) {
      headers.set(name, value);
      return this;
    },
    setHeader(name, value) {
      headers.set(name, value);
      return this;
    },
    get statusCode() {
      return statusCode;
    },
    mergeHeaders(extraHeaders) {
      if (!extraHeaders) return;
      for (const [key, value] of extraHeaders.entries()) {
        headers.set(key, value);
      }
    },
    toNextResponse() {
      if (statusCode === 204) {
        return new NextResponse(null, { status: statusCode, headers });
      }
      if (isJson) {
        return NextResponse.json(body ?? null, { status: statusCode, headers });
      }
      return new NextResponse(body ?? null, { status: statusCode, headers });
    },
  };

  return res;
};

export const createRequestContext = async (request, context = {}) => {
  const url = new URL(request.url);
  const headers = Object.fromEntries(request.headers.entries());

  const req = {
    method: request.method,
    headers,
    query: parseQuery(url.searchParams),
    params: context.params || {},
    body: await parseBody(request),
    url: url.toString(),
    originalUrl: `${url.pathname}${url.search}`,
    path: url.pathname,
    ip: getRequestIp(request),
  };

  const res = createResponseAdapter();

  return { req, res };
};

export const handleApiRequest = async (request, context, handler, options = {}) => {
  const { req, res } = await createRequestContext(request, context);

  const wafResponse = await applyWaf(req);
  if (wafResponse) return wafResponse;

  const rateResult = await applyRateLimit(req);
  if (rateResult?.response) return rateResult.response;
  res.mergeHeaders(rateResult?.headers);

  if (options.requireAuth) {
    const authResponse = await requireAuth(req);
    if (authResponse) return authResponse;
  }

  if (options.requireAdmin) {
    const adminResponse = await requireAdmin(req);
    if (adminResponse) return adminResponse;
  }

  const result = await handler(req, res);
  if (result instanceof NextResponse) return result;

  return res.toNextResponse();
};
