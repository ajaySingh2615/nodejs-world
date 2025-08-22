export default function UserProfile({ params }: any) {
  const id = params?.id ?? "user";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Profile page{" "}
          <span className="ml-2 inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
            {id}
          </span>
        </p>
      </div>

      {/* Content card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              User ID
            </dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
              {id}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Status
            </dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
              —
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              About
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Add a short bio or user details here.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
