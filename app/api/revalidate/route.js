import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getPseoDetailPath, getPseoIntentPath } from "@/lib/pseo";

const getToken = (request) => {
  const headerToken = request.headers.get("x-revalidate-token");
  if (headerToken) return headerToken;
  const url = new URL(request.url);
  return url.searchParams.get("token");
};

const parseBody = async (request) => {
  try {
    return await request.json();
  } catch {
    return {};
  }
};

const normalizeToArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value].filter(Boolean);
};

const resolvePseoPaths = ({ intent, industry }) => {
  if (intent && industry) return [getPseoDetailPath(intent, industry)];
  if (intent) return [getPseoIntentPath(intent)];
  return [];
};

export async function POST(request) {
  const token = getToken(request);
  if (!token || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ message: "Invalid token." }, { status: 401 });
  }

  const body = await parseBody(request);
  const paths = new Set(normalizeToArray(body.path || body.paths));
  const tags = new Set(normalizeToArray(body.tag || body.tags));
  const pseoPaths = resolvePseoPaths(body.pseo || {});
  pseoPaths.forEach((path) => paths.add(path));

  paths.forEach((path) => revalidatePath(path));
  tags.forEach((tag) => revalidateTag(tag));

  return NextResponse.json({
    revalidated: true,
    paths: Array.from(paths),
    tags: Array.from(tags),
  });
}

export async function GET(request) {
  const token = getToken(request);
  if (!token || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ message: "Invalid token." }, { status: 401 });
  }

  const url = new URL(request.url);
  const path = url.searchParams.get("path");
  const tag = url.searchParams.get("tag");
  const intent = url.searchParams.get("intent");
  const industry = url.searchParams.get("industry");
  const paths = new Set();
  if (path) paths.add(path);
  resolvePseoPaths({ intent, industry }).forEach((resolved) => paths.add(resolved));
  const tags = normalizeToArray(tag);

  paths.forEach((resolved) => revalidatePath(resolved));
  tags.forEach((resolved) => revalidateTag(resolved));

  return NextResponse.json({
    revalidated: true,
    paths: Array.from(paths),
    tags,
  });
}
