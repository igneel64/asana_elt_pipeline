WITH tasks AS (
    SELECT * FROM {{ ref('stg_asana__tasks_current') }}
)

/* Median*/
SELECT
    percentile_cont(tsk.task_creation_to_completion_days, 0.5) OVER ()  as median_completion_rate,
FROM tasks AS tsk
WHERE tsk.task_is_completed = true;
