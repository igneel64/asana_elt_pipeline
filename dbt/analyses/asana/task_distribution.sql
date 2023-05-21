WITH tasks AS (
    SELECT * FROM {{ ref('stg_asana__tasks_current') }}
)

SELECT
    tsk.task_creation_to_completion_days,
    count(tsk.task_id) as task_count
FROM tasks AS tsk
WHERE tsk.task_is_completed = true
GROUP BY 1