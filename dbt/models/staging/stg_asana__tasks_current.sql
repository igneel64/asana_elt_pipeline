WITH tasks_source AS (
    SELECT * FROM {{ ref('asana_tasks_source') }}
),

tasks_current AS (
    SELECT * FROM tasks_source WHERE is_current = TRUE
)

SELECT * FROM tasks_current
