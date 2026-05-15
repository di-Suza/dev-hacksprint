import { Link } from "react-router";

function UserCard({ user }) {
  return (
    <article className="app-card rounded-2xl p-4">
      <Link to={`/profile/${user._id}`} className="flex items-start gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
          <img
            alt={user.userName}
            className="h-full w-full object-cover"
            src={user.profilePicture?.url}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-(--color-text)">{user.userName}</h3>
          {user.headline && (
            <p className="mt-1 text-sm text-(--color-muted) line-clamp-1">
              {user.headline}
            </p>
          )}
          {user.about && (
            <p className="mt-2 text-sm leading-6 text-(--color-muted) line-clamp-2">
              {user.about}
            </p>
          )}
          
          <div className="mt-3 flex items-center gap-4 text-xs text-(--color-muted)">
            {user.projectsCount > 0 && (
              <span>{user.projectsCount} project{user.projectsCount !== 1 ? 's' : ''}</span>
            )}
            {user.blogsCount > 0 && (
              <span>{user.blogsCount} blog{user.blogsCount !== 1 ? 's' : ''}</span>
            )}
            {user.followersCount > 0 && (
              <span>{user.followersCount} followers</span>
            )}
          </div>

          {user.skills?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {user.skills.slice(0, 5).map((skill) => (
                <span
                  className="app-chip rounded-full px-3 py-1 text-xs font-semibold"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

export default UserCard;
