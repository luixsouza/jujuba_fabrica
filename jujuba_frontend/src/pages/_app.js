import "@/styles/globals.css";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

const routeTitleMap = [
  { match: /^\/fornecedores/, title: "Jujuba - Fornecedoras" },
  { match: /^\/estoque/, title: "Jujuba - Estoque" },
  { match: /^\/vendas\/?$/, title: "Jujuba - Vendas" },
  { match: /^\/vendas\//, title: "Jujuba - Vendas" },
  { match: /^\/lotes/, title: "Jujuba - Lotes" },
  { match: /^\/vendas\/carrinho/, title: "Jujuba - Carrinho" },
  { match: /^\//, title: "Jujuba - ERP" },
];

function getTitleForPath(path) {
  if (!path) return "Jujuba - ERP";
  const entry = routeTitleMap.find((r) => r.match.test(path));
  return entry ? entry.title : "Jujuba - ERP";
}

const publicRoutes = [
  "/auth/login",
  "/singup/singup",
  "/reset_password/reset_password",
];

export default function App({ Component, pageProps }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    try {
      const title = getTitleForPath(pathname);
      if (typeof document !== "undefined") document.title = title;
    } catch (e) {
      // ignore
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route));

      if (!token && !isPublicRoute) {
        router.push("/auth/login");
      }
    }
  }, [pathname, router]);

  return <Component {...pageProps} />;
}
