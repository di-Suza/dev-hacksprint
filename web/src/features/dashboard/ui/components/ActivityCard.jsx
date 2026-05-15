function ActivityCard({ activity }) {
  return (
    <article className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
      <p className="text-sm font-bold">{activity.title}</p>
      <p className="mt-2 text-sm text-(--color-muted)">{activity.description}</p>
    </article>
  );
}

export default ActivityCard;
