/**
 * @param {Task} task
 * @param {AppConfig} appConfig
 */
export async function sendTaskToDatabase(appConfig, task) {

  /**
   * @param {Task}task
   * @return {{notes: *, description, title, deadline: number, complete: *}}
   */
  function taskToDbTask(task) {
    return {
      title: task.title,
      description: task.description,
      priority: task.priority,
      notes: task.notes,
      deadline: Math.floor(new Date(task.dueDate).getTime() / 1000),
      complete: task.complete
    };
  }

  const response = await fetch(`/api/v1/${appConfig.session.userID}/tasks`, {
    method: "POST",
    body: JSON.stringify(
      taskToDbTask(task)
    )
  });
  if (!response.ok && response.status !== 200) {
    throw new Error("failed to create project");
  }
  return response.json();
}

export async function deleteTaskFromDatabase(appConfig, taskID) {
  const response = await fetch(`/api/v1/${appConfig.session.userID}/tasks/${taskID}`, {
    method: "DELETE"
  });
  if (!response.ok && response.status !== 200) {
    throw new Error("failed to delete project");
  }
  return response.json();
}
