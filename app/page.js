import ImageGenerator from "./ImageGenerator";
import PasswordProtect from "../components/PasswordProtect";

export default function HomePage() {
  return (
    <PasswordProtect>
      <ImageGenerator />
    </PasswordProtect>
  );
}
