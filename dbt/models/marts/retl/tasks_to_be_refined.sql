WITH tasks_current AS (
    SELECT * FROM {{ ref('stg_asana__tasks_current') }}
), 

incomplete_tasks AS (
    SELECT * FROM tasks_current WHERE task_is_completed = false
)

SELECT
    task_id
FROM incomplete_tasks
WHERE timestamp_diff(CURRENT_TIMESTAMP(), COALESCE(task_modified_at, task_created_at), DAY) > 14