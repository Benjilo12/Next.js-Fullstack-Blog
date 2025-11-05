// components/Header.jsx
import { HeaderContent } from "./HeaderContent";

export function Header({ searchParams = {} }) {
  return <HeaderContent initialSearchParams={searchParams} />;
}
