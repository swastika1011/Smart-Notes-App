import { getCurrentUser } from "@/lib/auth";
import NavigationClient from "@/components/NavigationClient";

const Navigation = async () => {
  const user = await getCurrentUser();

  return <NavigationClient isLoggedIn={Boolean(user)} />;
};

export default Navigation;
