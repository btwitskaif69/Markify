import { Error404 } from "@/components/pixeleted-404-not-found";

export const metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return <Error404 />;
}
