/**
 * @param {Project} project
 * @return {{notes: *, description, title, deadline: number, complete: *}}
 */
function projectToDbProject(project) {
  return {
    id: project.id ?? undefined,
    title: project.title,
    description: project.description,
    notes: project.notes,
    deadline: Math.floor(new Date(project.date).getTime() / 1000),
    complete: project.complete
  };
}

/**
 * @param {Project} project
 * @param {AppConfig} appConfig
 */
export async function sendProjectToDatabase(appConfig, project) {
  const response = await fetch(`/api/v1/${appConfig.session.userID}/projects`, {
    method: "POST",
    body: JSON.stringify(
      projectToDbProject(project)
    )
  });
  if (!response.ok && response.status !== 200) {
    throw new Error("failed to create project");
  }
  return response.json();
}

export async function deleteProjectFromDatabase(appConfig, projectID) {
  const response = await fetch(`/api/v1/${appConfig.session.userID}/projects/${projectID}`, {
    method: "DELETE"
  });
  if (!response.ok && response.status !== 200) {
    throw new Error("failed to delete project");
  }
  return response.json();
}

/**
 * @param {AppConfig} appConfig
 * @param {Project} project
 * @return {Promise<any>}
 */
export async function updateDatabaseProject(appConfig, project) {
  const response = await fetch(`/api/v1/${appConfig.session.userID}/projects/${project.id}`, {
    method: "PUT",
    body: JSON.stringify(
      projectToDbProject(project)
    )
  });
  if (!response.ok && response.status !== 200) {
    throw new Error("failed to create project");
  }
  return response.json();
}
