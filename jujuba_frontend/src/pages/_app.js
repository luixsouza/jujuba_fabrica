import "@/styles/globals.css";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

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

export default function App({ Component, pageProps }) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const title = getTitleForPath(pathname);
      if (typeof document !== "undefined") document.title = title;
    } catch (e) {
      // ignore
    }
  }, [pathname]);

  return <Component {...pageProps} />;
}
