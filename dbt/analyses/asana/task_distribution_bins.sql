WITH tasks AS (
    SELECT * FROM {{ ref('stg_asana__tasks_current') }}
),

task_bins AS (
    SELECT
        floor(tsk.task_creation_to_completion_days / 10) * 10 AS bins_floor,
        count(tsk.task_id) AS task_count
    FROM tasks AS tsk
    WHERE tsk.task_is_completed = true
    GROUP BY 1
)

SELECT
    bins_floor AS task_completion_days,
    bins_floor || ' - ' || (bins_floor + 10) AS task_completion_days_range,
    task_count
FROM task_bins