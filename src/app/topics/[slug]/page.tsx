import { getTopicBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import TopicPageClient from "./TopicPageClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: "Topic Not Found" };
  return {
    title: `${topic.title} — Success Bridge`,
    description: topic.description,
  };
}

export default async function TopicSlugPage({ params }: Props) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  return <TopicPageClient topic={topic} />;
}
