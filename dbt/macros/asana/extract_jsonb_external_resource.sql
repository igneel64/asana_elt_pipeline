{% macro extract_jsonb_external_resource(target_attribute_name, target_model_name, result_column_name) %}
    SELECT
        id,
        updated_at,
        (
            jsonb_array_elements((info::jsonb ->> '{{target_attribute_name}}')::jsonb)
            ->> 'gid'
        )::bigint AS {{result_column_name}}
    FROM {{target_model_name}}
{% endmacro %}