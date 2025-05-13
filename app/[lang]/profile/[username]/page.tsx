// app/[lang]/profile/[username]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    lang: string;
    username: string;
  };
};

export default async function ProfilePage({ params }: Props) {
  const { username } = params;

  const user = await prisma.userInfo.findFirst({
    where: { username },
    select: { id: true, username: true, avatar: true },
  });

  if (!user) return notFound();

  return (
    <div>
      <h1>Profil de {user.username}</h1>
      <p>ID utilisateur : {user.id}</p>
      <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.username}`} width="100" alt={`${user.username}'s avatar`} />
    </div>
  );
}
