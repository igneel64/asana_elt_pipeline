WITH users_source AS (
    SELECT * FROM {{ ref('asana_users_source') }}
),

projects_source AS (
    SELECT * FROM {{ ref('asana_projects_source') }}
),

project_members AS (
    {% if target.name == 'prod' %}
    SELECT
        project_id,
        CAST(member_id AS BIGNUMERIC) AS member_id
    FROM projects_source, unnest(project_members) AS member_id
    {% else %}
    SELECT
        projects_source.project_id,
        unnest(projects_source.project_members)::bigint AS member_id
    FROM projects_source
    {% endif %}
),

project_members_junction AS (
    SELECT
        u.user_email,
        u.user_name,
        p.member_id,
        p.project_id
    FROM users_source AS u
    INNER JOIN project_members AS p ON p.member_id = u.user_id
)

SELECT * FROM project_members_junction
