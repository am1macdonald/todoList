/**
 * @param {Project} project
 * @param {AppConfig} appConfig
 */
export async function sendProjectToDatabase(appConfig, project) {

  function projectToDbProject(project) {
    return {
      title: project.title,
      description: project.description,
      notes: project.notes,
      deadline: Math.floor(new Date(project.date).getTime() / 1000),
      complete: project.complete
    };
  }

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
