import { getCurrentUser } from "@/lib/data";
import { ProfileForm } from "@/components/modules/profile-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profil Pengguna" };

export default async function ProfilPage() {
  const user = await getCurrentUser();
  return <ProfileForm user={user} />;
}
