{% macro extract_repeated_record_values(target_attribute_name, target_model_name, result_column_name) %}
    SELECT 
        id,
        updated_at,
        CAST(record.gid AS BIGNUMERIC) AS {{result_column_name}}
    FROM {{target_model_name}} AS project,
    UNNEST(info.{{target_attribute_name}}) AS record
{% endmacro %}
