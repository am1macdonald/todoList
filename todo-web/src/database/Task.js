/**
 * @param {Task}task
 * @return {{notes: *, description, title, deadline: number, complete: *}}
 */
function taskToDbTask(task) {
  return {
    id: task.id ?? undefined,
    title: task.title,
    description: task.description,
    priority: task.priority,
    notes: task.notes,
    deadline: task.deadline,
    complete: task.complete
  };
}

/**
 * @param {Task} task
 * @param {AppConfig} appConfig
 */
export async function sendTaskToDatabase(appConfig, task) {


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
    throw new Error("failed to delete task");
  }
  return response.json();
}

/**
 * @param {AppConfig} appConfig
 * @param {Task} task
 * @return {Promise<any>}
 */
export async function updateDatabaseTask(appConfig, task) {
  const response = await fetch(`/api/v1/${appConfig.session.userID}/tasks/${task.id}`, {
    method: "PUT",
    body: JSON.stringify(
      taskToDbTask(task)
    )
  });
  if (!response.ok && response.status !== 200) {
    throw new Error("failed to update task");
  }
  return response.json();
}
