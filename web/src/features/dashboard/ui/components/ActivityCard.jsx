function ActivityCard({ activity }) {
  return (
    <article className="app-card rounded-2xl p-4">
      <p className="text-sm font-bold">{activity.title}</p>
      <p className="mt-2 text-sm text-(--color-muted)">{activity.description}</p>
    </article>
  );
}

export default ActivityCard;
