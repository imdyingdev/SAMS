--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5

-- Started on 2025-11-11 01:40:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 20 (class 2615 OID 17181)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "auth";


--
-- TOC entry 1 (class 3079 OID 106577)
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";


--
-- TOC entry 4483 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION "pg_cron"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pg_cron" IS 'Job scheduler for PostgreSQL';


--
-- TOC entry 12 (class 2615 OID 17182)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "extensions";


--
-- TOC entry 24 (class 2615 OID 17183)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "graphql";


--
-- TOC entry 23 (class 2615 OID 17184)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "graphql_public";


--
-- TOC entry 4484 (class 0 OID 0)
-- Dependencies: 25
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- TOC entry 9 (class 3079 OID 106650)
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "public";


--
-- TOC entry 4485 (class 0 OID 0)
-- Dependencies: 9
-- Name: EXTENSION "pg_net"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pg_net" IS 'Async HTTP';


--
-- TOC entry 15 (class 2615 OID 17185)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "pgbouncer";


--
-- TOC entry 18 (class 2615 OID 17186)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "realtime";


--
-- TOC entry 21 (class 2615 OID 17187)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "storage";


--
-- TOC entry 22 (class 2615 OID 17188)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "vault";


--
-- TOC entry 8 (class 3079 OID 107002)
-- Name: http; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "public";


--
-- TOC entry 4486 (class 0 OID 0)
-- Dependencies: 8
-- Name: EXTENSION "http"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "http" IS 'HTTP client for PostgreSQL, allows web page retrieval inside the database.';


--
-- TOC entry 7 (class 3079 OID 17896)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";


--
-- TOC entry 4487 (class 0 OID 0)
-- Dependencies: 7
-- Name: EXTENSION "pg_graphql"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pg_graphql" IS 'pg_graphql: GraphQL support';


--
-- TOC entry 5 (class 3079 OID 17199)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- TOC entry 4488 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION "pg_stat_statements"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pg_stat_statements" IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 4 (class 3079 OID 17236)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- TOC entry 4489 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION "pgcrypto"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pgcrypto" IS 'cryptographic functions';


--
-- TOC entry 6 (class 3079 OID 17273)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";


--
-- TOC entry 4490 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION "supabase_vault"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "supabase_vault" IS 'Supabase Vault Extension';


--
-- TOC entry 3 (class 3079 OID 17296)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- TOC entry 4491 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1211 (class 1247 OID 17308)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."aal_level" AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- TOC entry 1214 (class 1247 OID 17316)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."code_challenge_method" AS ENUM (
    's256',
    'plain'
);


--
-- TOC entry 1217 (class 1247 OID 17322)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_status" AS ENUM (
    'unverified',
    'verified'
);


--
-- TOC entry 1220 (class 1247 OID 17328)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_type" AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- TOC entry 1402 (class 1247 OID 85746)
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_authorization_status" AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- TOC entry 1414 (class 1247 OID 85819)
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_client_type" AS ENUM (
    'public',
    'confidential'
);


--
-- TOC entry 1344 (class 1247 OID 33498)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_registration_type" AS ENUM (
    'dynamic',
    'manual'
);


--
-- TOC entry 1405 (class 1247 OID 85756)
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_response_type" AS ENUM (
    'code'
);


--
-- TOC entry 1223 (class 1247 OID 17336)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."one_time_token_type" AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- TOC entry 1226 (class 1247 OID 17350)
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."action" AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- TOC entry 1229 (class 1247 OID 17362)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."equality_op" AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- TOC entry 1232 (class 1247 OID 17379)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."user_defined_filter" AS (
	"column_name" "text",
	"op" "realtime"."equality_op",
	"value" "text"
);


--
-- TOC entry 1235 (class 1247 OID 17382)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."wal_column" AS (
	"name" "text",
	"type_name" "text",
	"type_oid" "oid",
	"value" "jsonb",
	"is_pkey" boolean,
	"is_selectable" boolean
);


--
-- TOC entry 1238 (class 1247 OID 17385)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."wal_rls" AS (
	"wal" "jsonb",
	"is_rls_enabled" boolean,
	"subscription_ids" "uuid"[],
	"errors" "text"[]
);


--
-- TOC entry 1375 (class 1247 OID 73402)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE "storage"."buckettype" AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


--
-- TOC entry 543 (class 1255 OID 17386)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."email"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- TOC entry 4492 (class 0 OID 0)
-- Dependencies: 543
-- Name: FUNCTION "email"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."email"() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 446 (class 1255 OID 17387)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."jwt"() RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- TOC entry 429 (class 1255 OID 17388)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."role"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- TOC entry 4493 (class 0 OID 0)
-- Dependencies: 429
-- Name: FUNCTION "role"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."role"() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 514 (class 1255 OID 17389)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- TOC entry 4494 (class 0 OID 0)
-- Dependencies: 514
-- Name: FUNCTION "uid"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."uid"() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 426 (class 1255 OID 17390)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_cron_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- TOC entry 4495 (class 0 OID 0)
-- Dependencies: 426
-- Name: FUNCTION "grant_pg_cron_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_cron_access"() IS 'Grants access to pg_cron';


--
-- TOC entry 457 (class 1255 OID 17391)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_graphql_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- TOC entry 4496 (class 0 OID 0)
-- Dependencies: 457
-- Name: FUNCTION "grant_pg_graphql_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_graphql_access"() IS 'Grants access to pg_graphql';


--
-- TOC entry 438 (class 1255 OID 17392)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_net_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- TOC entry 4497 (class 0 OID 0)
-- Dependencies: 438
-- Name: FUNCTION "grant_pg_net_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_net_access"() IS 'Grants access to pg_net';


--
-- TOC entry 562 (class 1255 OID 17393)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."pgrst_ddl_watch"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 517 (class 1255 OID 17394)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."pgrst_drop_watch"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 544 (class 1255 OID 17395)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."set_graphql_placeholder"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- TOC entry 4498 (class 0 OID 0)
-- Dependencies: 544
-- Name: FUNCTION "set_graphql_placeholder"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."set_graphql_placeholder"() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 496 (class 1255 OID 17396)
-- Name: get_auth("text"); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION "pgbouncer"."get_auth"("p_usename" "text") RETURNS TABLE("username" "text", "password" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


--
-- TOC entry 536 (class 1255 OID 74591)
-- Name: update_user_last_login("text"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."update_user_last_login"("user_email" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE users 
    SET last_login = NOW() 
    WHERE email = user_email AND is_active = true;
END;
$$;


--
-- TOC entry 4499 (class 0 OID 0)
-- Dependencies: 536
-- Name: FUNCTION "update_user_last_login"("user_email" "text"); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION "public"."update_user_last_login"("user_email" "text") IS 'Updates last_login timestamp for a user by email.';


--
-- TOC entry 571 (class 1255 OID 74589)
-- Name: update_users_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."update_users_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- TOC entry 579 (class 1255 OID 17397)
-- Name: apply_rls("jsonb", integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer DEFAULT (1024 * 1024)) RETURNS SETOF "realtime"."wal_rls"
    LANGUAGE "plpgsql"
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- TOC entry 440 (class 1255 OID 17399)
-- Name: broadcast_changes("text", "text", "text", "text", "text", "record", "record", "text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text" DEFAULT 'ROW'::"text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- TOC entry 584 (class 1255 OID 17400)
-- Name: build_prepared_statement_sql("text", "regclass", "realtime"."wal_column"[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]) RETURNS "text"
    LANGUAGE "sql"
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- TOC entry 460 (class 1255 OID 17401)
-- Name: cast("text", "regtype"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."cast"("val" "text", "type_" "regtype") RETURNS "jsonb"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- TOC entry 477 (class 1255 OID 17402)
-- Name: check_equality_op("realtime"."equality_op", "regtype", "text", "text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text") RETURNS boolean
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- TOC entry 488 (class 1255 OID 17403)
-- Name: is_visible_through_filters("realtime"."wal_column"[], "realtime"."user_defined_filter"[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]) RETURNS boolean
    LANGUAGE "sql" IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- TOC entry 428 (class 1255 OID 17404)
-- Name: list_changes("name", "name", integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer) RETURNS SETOF "realtime"."wal_rls"
    LANGUAGE "sql"
    SET "log_min_messages" TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- TOC entry 481 (class 1255 OID 17405)
-- Name: quote_wal2json("regclass"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."quote_wal2json"("entity" "regclass") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- TOC entry 498 (class 1255 OID 17406)
-- Name: send("jsonb", "text", "text", boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean DEFAULT true) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- TOC entry 581 (class 1255 OID 17407)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."subscription_check_filters"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- TOC entry 448 (class 1255 OID 17408)
-- Name: to_regrole("text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."to_regrole"("role_name" "text") RETURNS "regrole"
    LANGUAGE "sql" IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- TOC entry 489 (class 1255 OID 17409)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."topic"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- TOC entry 500 (class 1255 OID 73380)
-- Name: add_prefixes("text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."add_prefixes"("_bucket_id" "text", "_name" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- TOC entry 459 (class 1255 OID 17410)
-- Name: can_insert_object("text", "text", "uuid", "jsonb"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- TOC entry 442 (class 1255 OID 73421)
-- Name: delete_leaf_prefixes("text"[], "text"[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_leaf_prefixes"("bucket_ids" "text"[], "names" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


--
-- TOC entry 451 (class 1255 OID 73381)
-- Name: delete_prefix("text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_prefix"("_bucket_id" "text", "_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- TOC entry 435 (class 1255 OID 73384)
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."delete_prefix_hierarchy_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- TOC entry 486 (class 1255 OID 73399)
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."enforce_bucket_name_length"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- TOC entry 505 (class 1255 OID 17411)
-- Name: extension("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."extension"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- TOC entry 487 (class 1255 OID 17412)
-- Name: filename("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."filename"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- TOC entry 454 (class 1255 OID 17413)
-- Name: foldername("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."foldername"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- TOC entry 466 (class 1255 OID 73362)
-- Name: get_level("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_level"("name" "text") RETURNS integer
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- TOC entry 545 (class 1255 OID 73378)
-- Name: get_prefix("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_prefix"("name" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- TOC entry 568 (class 1255 OID 73379)
-- Name: get_prefixes("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_prefixes"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql" IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- TOC entry 561 (class 1255 OID 73397)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_size_by_bucket"() RETURNS TABLE("size" bigint, "bucket_id" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- TOC entry 549 (class 1255 OID 17415)
-- Name: list_multipart_uploads_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "next_key_token" "text" DEFAULT ''::"text", "next_upload_token" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "id" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- TOC entry 467 (class 1255 OID 17416)
-- Name: list_objects_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "start_after" "text" DEFAULT ''::"text", "next_token" "text" DEFAULT ''::"text") RETURNS TABLE("name" "text", "id" "uuid", "metadata" "jsonb", "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- TOC entry 456 (class 1255 OID 73420)
-- Name: lock_top_prefixes("text"[], "text"[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."lock_top_prefixes"("bucket_ids" "text"[], "names" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


--
-- TOC entry 431 (class 1255 OID 73422)
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_delete_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- TOC entry 564 (class 1255 OID 73383)
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_insert_prefix_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- TOC entry 510 (class 1255 OID 73423)
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


--
-- TOC entry 530 (class 1255 OID 73428)
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_level_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


--
-- TOC entry 538 (class 1255 OID 73398)
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."objects_update_prefix_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- TOC entry 432 (class 1255 OID 17417)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."operation"() RETURNS "text"
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- TOC entry 439 (class 1255 OID 73424)
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."prefixes_delete_cleanup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- TOC entry 569 (class 1255 OID 73382)
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."prefixes_insert_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- TOC entry 555 (class 1255 OID 17418)
-- Name: search("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- TOC entry 527 (class 1255 OID 73395)
-- Name: search_legacy_v1("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_legacy_v1"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 540 (class 1255 OID 73394)
-- Name: search_v1_optimised("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_v1_optimised"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 441 (class 1255 OID 73419)
-- Name: search_v2("text", "text", integer, integer, "text", "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search_v2"("prefix" "text", "bucket_name" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "start_after" "text" DEFAULT ''::"text", "sort_order" "text" DEFAULT 'asc'::"text", "sort_column" "text" DEFAULT 'name'::"text", "sort_column_after" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


--
-- TOC entry 506 (class 1255 OID 17419)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- TOC entry 354 (class 1259 OID 17420)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."audit_log_entries" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "payload" json,
    "created_at" timestamp with time zone,
    "ip_address" character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- TOC entry 4500 (class 0 OID 0)
-- Dependencies: 354
-- Name: TABLE "audit_log_entries"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."audit_log_entries" IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 355 (class 1259 OID 17426)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."flow_state" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "auth_code" "text" NOT NULL,
    "code_challenge_method" "auth"."code_challenge_method" NOT NULL,
    "code_challenge" "text" NOT NULL,
    "provider_type" "text" NOT NULL,
    "provider_access_token" "text",
    "provider_refresh_token" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" "text" NOT NULL,
    "auth_code_issued_at" timestamp with time zone
);


--
-- TOC entry 4501 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE "flow_state"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."flow_state" IS 'stores metadata for pkce logins';


--
-- TOC entry 356 (class 1259 OID 17431)
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."identities" (
    "provider_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "identity_data" "jsonb" NOT NULL,
    "provider" "text" NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" "text" GENERATED ALWAYS AS ("lower"(("identity_data" ->> 'email'::"text"))) STORED,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- TOC entry 4502 (class 0 OID 0)
-- Dependencies: 356
-- Name: TABLE "identities"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."identities" IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4503 (class 0 OID 0)
-- Dependencies: 356
-- Name: COLUMN "identities"."email"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."identities"."email" IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 357 (class 1259 OID 17438)
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."instances" (
    "id" "uuid" NOT NULL,
    "uuid" "uuid",
    "raw_base_config" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


--
-- TOC entry 4504 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE "instances"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."instances" IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 358 (class 1259 OID 17443)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_amr_claims" (
    "session_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" "text" NOT NULL,
    "id" "uuid" NOT NULL
);


--
-- TOC entry 4505 (class 0 OID 0)
-- Dependencies: 358
-- Name: TABLE "mfa_amr_claims"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_amr_claims" IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 359 (class 1259 OID 17448)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_challenges" (
    "id" "uuid" NOT NULL,
    "factor_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" "inet" NOT NULL,
    "otp_code" "text",
    "web_authn_session_data" "jsonb"
);


--
-- TOC entry 4506 (class 0 OID 0)
-- Dependencies: 359
-- Name: TABLE "mfa_challenges"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_challenges" IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 360 (class 1259 OID 17453)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_factors" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "friendly_name" "text",
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" "text",
    "phone" "text",
    "last_challenged_at" timestamp with time zone,
    "web_authn_credential" "jsonb",
    "web_authn_aaguid" "uuid",
    "last_webauthn_challenge_data" "jsonb"
);


--
-- TOC entry 4507 (class 0 OID 0)
-- Dependencies: 360
-- Name: TABLE "mfa_factors"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_factors" IS 'auth: stores metadata about factors';


--
-- TOC entry 4508 (class 0 OID 0)
-- Dependencies: 360
-- Name: COLUMN "mfa_factors"."last_webauthn_challenge_data"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."mfa_factors"."last_webauthn_challenge_data" IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- TOC entry 392 (class 1259 OID 85759)
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_authorizations" (
    "id" "uuid" NOT NULL,
    "authorization_id" "text" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "redirect_uri" "text" NOT NULL,
    "scope" "text" NOT NULL,
    "state" "text",
    "resource" "text",
    "code_challenge" "text",
    "code_challenge_method" "auth"."code_challenge_method",
    "response_type" "auth"."oauth_response_type" DEFAULT 'code'::"auth"."oauth_response_type" NOT NULL,
    "status" "auth"."oauth_authorization_status" DEFAULT 'pending'::"auth"."oauth_authorization_status" NOT NULL,
    "authorization_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '00:03:00'::interval) NOT NULL,
    "approved_at" timestamp with time zone,
    CONSTRAINT "oauth_authorizations_authorization_code_length" CHECK (("char_length"("authorization_code") <= 255)),
    CONSTRAINT "oauth_authorizations_code_challenge_length" CHECK (("char_length"("code_challenge") <= 128)),
    CONSTRAINT "oauth_authorizations_expires_at_future" CHECK (("expires_at" > "created_at")),
    CONSTRAINT "oauth_authorizations_redirect_uri_length" CHECK (("char_length"("redirect_uri") <= 2048)),
    CONSTRAINT "oauth_authorizations_resource_length" CHECK (("char_length"("resource") <= 2048)),
    CONSTRAINT "oauth_authorizations_scope_length" CHECK (("char_length"("scope") <= 4096)),
    CONSTRAINT "oauth_authorizations_state_length" CHECK (("char_length"("state") <= 4096))
);


--
-- TOC entry 387 (class 1259 OID 33503)
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_clients" (
    "id" "uuid" NOT NULL,
    "client_secret_hash" "text",
    "registration_type" "auth"."oauth_registration_type" NOT NULL,
    "redirect_uris" "text" NOT NULL,
    "grant_types" "text" NOT NULL,
    "client_name" "text",
    "client_uri" "text",
    "logo_uri" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "client_type" "auth"."oauth_client_type" DEFAULT 'confidential'::"auth"."oauth_client_type" NOT NULL,
    CONSTRAINT "oauth_clients_client_name_length" CHECK (("char_length"("client_name") <= 1024)),
    CONSTRAINT "oauth_clients_client_uri_length" CHECK (("char_length"("client_uri") <= 2048)),
    CONSTRAINT "oauth_clients_logo_uri_length" CHECK (("char_length"("logo_uri") <= 2048))
);


--
-- TOC entry 393 (class 1259 OID 85792)
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."oauth_consents" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "scopes" "text" NOT NULL,
    "granted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "revoked_at" timestamp with time zone,
    CONSTRAINT "oauth_consents_revoked_after_granted" CHECK ((("revoked_at" IS NULL) OR ("revoked_at" >= "granted_at"))),
    CONSTRAINT "oauth_consents_scopes_length" CHECK (("char_length"("scopes") <= 2048)),
    CONSTRAINT "oauth_consents_scopes_not_empty" CHECK (("char_length"(TRIM(BOTH FROM "scopes")) > 0))
);


--
-- TOC entry 361 (class 1259 OID 17458)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."one_time_tokens" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" "text" NOT NULL,
    "relates_to" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK (("char_length"("token_hash") > 0))
);


--
-- TOC entry 362 (class 1259 OID 17466)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."refresh_tokens" (
    "instance_id" "uuid",
    "id" bigint NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" "uuid"
);


--
-- TOC entry 4509 (class 0 OID 0)
-- Dependencies: 362
-- Name: TABLE "refresh_tokens"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."refresh_tokens" IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 363 (class 1259 OID 17471)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4510 (class 0 OID 0)
-- Dependencies: 363
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNED BY "auth"."refresh_tokens"."id";


--
-- TOC entry 364 (class 1259 OID 17472)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."saml_providers" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "entity_id" "text" NOT NULL,
    "metadata_xml" "text" NOT NULL,
    "metadata_url" "text",
    "attribute_mapping" "jsonb",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" "text",
    CONSTRAINT "entity_id not empty" CHECK (("char_length"("entity_id") > 0)),
    CONSTRAINT "metadata_url not empty" CHECK ((("metadata_url" = NULL::"text") OR ("char_length"("metadata_url") > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK (("char_length"("metadata_xml") > 0))
);


--
-- TOC entry 4511 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE "saml_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_providers" IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 365 (class 1259 OID 17480)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."saml_relay_states" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "request_id" "text" NOT NULL,
    "for_email" "text",
    "redirect_to" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" "uuid",
    CONSTRAINT "request_id not empty" CHECK (("char_length"("request_id") > 0))
);


--
-- TOC entry 4512 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE "saml_relay_states"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_relay_states" IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 366 (class 1259 OID 17486)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);


--
-- TOC entry 4513 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE "schema_migrations"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."schema_migrations" IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 367 (class 1259 OID 17489)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sessions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" "uuid",
    "aal" "auth"."aal_level",
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp without time zone,
    "user_agent" "text",
    "ip" "inet",
    "tag" "text",
    "oauth_client_id" "uuid",
    "refresh_token_hmac_key" "text",
    "refresh_token_counter" bigint
);


--
-- TOC entry 4514 (class 0 OID 0)
-- Dependencies: 367
-- Name: TABLE "sessions"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sessions" IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4515 (class 0 OID 0)
-- Dependencies: 367
-- Name: COLUMN "sessions"."not_after"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."not_after" IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 4516 (class 0 OID 0)
-- Dependencies: 367
-- Name: COLUMN "sessions"."refresh_token_hmac_key"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_hmac_key" IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- TOC entry 4517 (class 0 OID 0)
-- Dependencies: 367
-- Name: COLUMN "sessions"."refresh_token_counter"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."refresh_token_counter" IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- TOC entry 368 (class 1259 OID 17494)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sso_domains" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK (("char_length"("domain") > 0))
);


--
-- TOC entry 4518 (class 0 OID 0)
-- Dependencies: 368
-- Name: TABLE "sso_domains"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_domains" IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 369 (class 1259 OID 17500)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sso_providers" (
    "id" "uuid" NOT NULL,
    "resource_id" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "disabled" boolean,
    CONSTRAINT "resource_id not empty" CHECK ((("resource_id" = NULL::"text") OR ("char_length"("resource_id") > 0)))
);


--
-- TOC entry 4519 (class 0 OID 0)
-- Dependencies: 369
-- Name: TABLE "sso_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_providers" IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4520 (class 0 OID 0)
-- Dependencies: 369
-- Name: COLUMN "sso_providers"."resource_id"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sso_providers"."resource_id" IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 370 (class 1259 OID 17506)
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."users" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "confirmation_token" character varying(255),
    "confirmation_sent_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" "jsonb",
    "raw_user_meta_data" "jsonb",
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" "text" DEFAULT NULL::character varying,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" "text" DEFAULT ''::character varying,
    "phone_change_token" character varying(255) DEFAULT ''::character varying,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST("email_confirmed_at", "phone_confirmed_at")) STORED,
    "email_change_token_current" character varying(255) DEFAULT ''::character varying,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" character varying(255) DEFAULT ''::character varying,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((("email_change_confirm_status" >= 0) AND ("email_change_confirm_status" <= 2)))
);


--
-- TOC entry 4521 (class 0 OID 0)
-- Dependencies: 370
-- Name: TABLE "users"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."users" IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4522 (class 0 OID 0)
-- Dependencies: 370
-- Name: COLUMN "users"."is_sso_user"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."users"."is_sso_user" IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 371 (class 1259 OID 17521)
-- Name: admin_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."admin_users" (
    "id" integer NOT NULL,
    "username" character varying(50) NOT NULL,
    "password_hash" character varying(255) NOT NULL,
    "role" character varying(20) DEFAULT 'admin'::character varying,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 372 (class 1259 OID 17527)
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."admin_users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4523 (class 0 OID 0)
-- Dependencies: 372
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."admin_users_id_seq" OWNED BY "public"."admin_users"."id";


--
-- TOC entry 399 (class 1259 OID 93012)
-- Name: announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."announcements" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- TOC entry 4524 (class 0 OID 0)
-- Dependencies: 399
-- Name: TABLE "announcements"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."announcements" IS 'Stores system announcements created by administrators';


--
-- TOC entry 4525 (class 0 OID 0)
-- Dependencies: 399
-- Name: COLUMN "announcements"."id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."announcements"."id" IS 'Unique identifier for each announcement';


--
-- TOC entry 4526 (class 0 OID 0)
-- Dependencies: 399
-- Name: COLUMN "announcements"."title"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."announcements"."title" IS 'Title of the announcement';


--
-- TOC entry 4527 (class 0 OID 0)
-- Dependencies: 399
-- Name: COLUMN "announcements"."content"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."announcements"."content" IS 'Full content/body of the announcement';


--
-- TOC entry 4528 (class 0 OID 0)
-- Dependencies: 399
-- Name: COLUMN "announcements"."created_at"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."announcements"."created_at" IS 'Timestamp when announcement was created';


--
-- TOC entry 4529 (class 0 OID 0)
-- Dependencies: 399
-- Name: COLUMN "announcements"."updated_at"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."announcements"."updated_at" IS 'Timestamp when announcement was last updated';


--
-- TOC entry 398 (class 1259 OID 93011)
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."announcements_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4530 (class 0 OID 0)
-- Dependencies: 398
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."announcements_id_seq" OWNED BY "public"."announcements"."id";


--
-- TOC entry 397 (class 1259 OID 90482)
-- Name: attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."attendance" (
    "id" integer NOT NULL,
    "student_id" integer,
    "attendance_date" "date" NOT NULL,
    "status" character varying(10),
    "notes" "text",
    "recorded_by" integer,
    "recorded_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendance_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['present'::character varying, 'absent'::character varying, 'late'::character varying, 'excused'::character varying])::"text"[])))
);


--
-- TOC entry 396 (class 1259 OID 90481)
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."attendance_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4531 (class 0 OID 0)
-- Dependencies: 396
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."attendance_id_seq" OWNED BY "public"."attendance"."id";


--
-- TOC entry 407 (class 1259 OID 106543)
-- Name: auto_timeout_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."auto_timeout_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rfid" character varying(255) NOT NULL,
    "original_time_in" timestamp with time zone NOT NULL,
    "auto_timeout_timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "inserted_log_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "notes" "text"
);


--
-- TOC entry 4532 (class 0 OID 0)
-- Dependencies: 407
-- Name: TABLE "auto_timeout_logs"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."auto_timeout_logs" IS 'Logs all automatic timeout insertions for students who forgot to tap out';


--
-- TOC entry 403 (class 1259 OID 104260)
-- Name: email_verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."email_verifications" (
    "email" "text" NOT NULL,
    "code" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- TOC entry 422 (class 1259 OID 107178)
-- Name: grade_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."grade_sections" (
    "id" bigint NOT NULL,
    "grade_level" "text" NOT NULL,
    "section_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- TOC entry 4533 (class 0 OID 0)
-- Dependencies: 422
-- Name: TABLE "grade_sections"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."grade_sections" IS 'Stores grade levels and their corresponding sections';


--
-- TOC entry 4534 (class 0 OID 0)
-- Dependencies: 422
-- Name: COLUMN "grade_sections"."id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."grade_sections"."id" IS 'Unique identifier for each grade-section combination';


--
-- TOC entry 4535 (class 0 OID 0)
-- Dependencies: 422
-- Name: COLUMN "grade_sections"."grade_level"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."grade_sections"."grade_level" IS 'Grade level (e.g., 1, 2, 3, K for Kindergarten)';


--
-- TOC entry 4536 (class 0 OID 0)
-- Dependencies: 422
-- Name: COLUMN "grade_sections"."section_name"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."grade_sections"."section_name" IS 'Section name in Title Case';


--
-- TOC entry 421 (class 1259 OID 107177)
-- Name: grade_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."grade_sections_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4537 (class 0 OID 0)
-- Dependencies: 421
-- Name: grade_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."grade_sections_id_seq" OWNED BY "public"."grade_sections"."id";


--
-- TOC entry 373 (class 1259 OID 17536)
-- Name: login_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."login_logs" (
    "id" integer NOT NULL,
    "user_id" integer,
    "success" boolean NOT NULL,
    "login_time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "ip_address" character varying(45)
);


--
-- TOC entry 374 (class 1259 OID 17540)
-- Name: login_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."login_logs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4538 (class 0 OID 0)
-- Dependencies: 374
-- Name: login_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."login_logs_id_seq" OWNED BY "public"."login_logs"."id";


--
-- TOC entry 394 (class 1259 OID 90302)
-- Name: rfid_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."rfid_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rfid" character varying(255) NOT NULL,
    "tap_count" integer NOT NULL,
    "tap_type" character varying(10) NOT NULL,
    "timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "rfid_logs_tap_count_check" CHECK (("tap_count" = ANY (ARRAY[1, 2]))),
    CONSTRAINT "rfid_logs_tap_type_check" CHECK ((("tap_type")::"text" = ANY ((ARRAY['time_in'::character varying, 'time_out'::character varying])::"text"[])))
);


--
-- TOC entry 395 (class 1259 OID 90316)
-- Name: rfid_latest_status; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW "public"."rfid_latest_status" AS
 SELECT DISTINCT ON ("rfid") "rfid",
    "tap_count",
    "tap_type",
    "timestamp",
        CASE
            WHEN ("tap_count" = 1) THEN 'Timed In'::"text"
            WHEN ("tap_count" = 2) THEN 'Timed Out'::"text"
            ELSE NULL::"text"
        END AS "status"
   FROM "public"."rfid_logs"
  ORDER BY "rfid", "timestamp" DESC;


--
-- TOC entry 386 (class 1259 OID 17915)
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."students" (
    "id" bigint NOT NULL,
    "first_name" "text" NOT NULL,
    "middle_name" "text",
    "last_name" "text" NOT NULL,
    "suffix" "text",
    "lrn" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "gender" character varying(10) DEFAULT 'Male'::character varying,
    "rfid" character varying(255),
    "grade_section_id" bigint NOT NULL,
    CONSTRAINT "students_gender_check" CHECK ((("gender")::"text" = ANY ((ARRAY['Male'::character varying, 'Female'::character varying])::"text"[])))
);


--
-- TOC entry 4539 (class 0 OID 0)
-- Dependencies: 386
-- Name: TABLE "students"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."students" IS 'Student data cleared - table structure preserved';


--
-- TOC entry 4540 (class 0 OID 0)
-- Dependencies: 386
-- Name: COLUMN "students"."id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."id" IS 'Unique identifier for each student.';


--
-- TOC entry 4541 (class 0 OID 0)
-- Dependencies: 386
-- Name: COLUMN "students"."first_name"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."first_name" IS 'Student''s first name.';


--
-- TOC entry 4542 (class 0 OID 0)
-- Dependencies: 386
-- Name: COLUMN "students"."middle_name"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."middle_name" IS 'Student''s middle name.';


--
-- TOC entry 4543 (class 0 OID 0)
-- Dependencies: 386
-- Name: COLUMN "students"."last_name"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."last_name" IS 'Student''s last name.';


--
-- TOC entry 4544 (class 0 OID 0)
-- Dependencies: 386
-- Name: COLUMN "students"."suffix"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."suffix" IS 'Student''s suffix (e.g., Jr., Sr.).';


--
-- TOC entry 4545 (class 0 OID 0)
-- Dependencies: 386
-- Name: COLUMN "students"."lrn"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."lrn" IS 'Learner Reference Number, a unique 12-digit identifier.';


--
-- TOC entry 4546 (class 0 OID 0)
-- Dependencies: 386
-- Name: COLUMN "students"."created_at"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."created_at" IS 'Timestamp of when the record was created.';


--
-- TOC entry 4547 (class 0 OID 0)
-- Dependencies: 386
-- Name: COLUMN "students"."gender"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."gender" IS 'Student gender (Male or Female).';


--
-- TOC entry 391 (class 1259 OID 74562)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users" (
    "id" bigint NOT NULL,
    "student_id" bigint NOT NULL,
    "email" "text" NOT NULL,
    "password_hash" "text" NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_login" timestamp with time zone
);


--
-- TOC entry 4548 (class 0 OID 0)
-- Dependencies: 391
-- Name: TABLE "users"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."users" IS 'User data cleared - table structure preserved';


--
-- TOC entry 4549 (class 0 OID 0)
-- Dependencies: 391
-- Name: COLUMN "users"."id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."id" IS 'Unique identifier for each user account.';


--
-- TOC entry 4550 (class 0 OID 0)
-- Dependencies: 391
-- Name: COLUMN "users"."student_id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."student_id" IS 'References students.id - allows login with LRN or student ID.';


--
-- TOC entry 4551 (class 0 OID 0)
-- Dependencies: 391
-- Name: COLUMN "users"."email"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."email" IS 'Student email address for login.';


--
-- TOC entry 4552 (class 0 OID 0)
-- Dependencies: 391
-- Name: COLUMN "users"."password_hash"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."password_hash" IS 'Bcrypt hashed password for security.';


--
-- TOC entry 4553 (class 0 OID 0)
-- Dependencies: 391
-- Name: COLUMN "users"."is_active"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."is_active" IS 'Whether the user account is active and can login.';


--
-- TOC entry 4554 (class 0 OID 0)
-- Dependencies: 391
-- Name: COLUMN "users"."created_at"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."created_at" IS 'Timestamp when user account was created.';


--
-- TOC entry 4555 (class 0 OID 0)
-- Dependencies: 391
-- Name: COLUMN "users"."updated_at"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."updated_at" IS 'Timestamp when user account was last updated.';


--
-- TOC entry 4556 (class 0 OID 0)
-- Dependencies: 391
-- Name: COLUMN "users"."last_login"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."last_login" IS 'Timestamp of last successful login.';


--
-- TOC entry 423 (class 1259 OID 107342)
-- Name: student_users; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW "public"."student_users" WITH ("security_invoker"='on') AS
 SELECT "u"."id" AS "user_id",
    "u"."email",
    "u"."is_active",
    "u"."created_at" AS "user_created_at",
    "u"."last_login",
    "s"."id" AS "student_id",
    "s"."first_name",
    "s"."middle_name",
    "s"."last_name",
    "s"."suffix",
    "s"."lrn",
    "gs"."grade_level",
    "gs"."section_name",
    "s"."rfid",
    "s"."gender",
    "s"."created_at" AS "student_created_at"
   FROM (("public"."users" "u"
     JOIN "public"."students" "s" ON (("u"."student_id" = "s"."id")))
     JOIN "public"."grade_sections" "gs" ON (("s"."grade_section_id" = "gs"."id")))
  WHERE ("u"."is_active" = true);


--
-- TOC entry 385 (class 1259 OID 17914)
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."students" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."students_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 390 (class 1259 OID 74561)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 375 (class 1259 OID 17547)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
)
PARTITION BY RANGE ("inserted_at");


--
-- TOC entry 400 (class 1259 OID 100877)
-- Name: messages_2025_11_02; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages_2025_11_02" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- TOC entry 401 (class 1259 OID 103129)
-- Name: messages_2025_11_03; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages_2025_11_03" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- TOC entry 402 (class 1259 OID 103141)
-- Name: messages_2025_11_04; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages_2025_11_04" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- TOC entry 404 (class 1259 OID 104290)
-- Name: messages_2025_11_05; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages_2025_11_05" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- TOC entry 405 (class 1259 OID 105405)
-- Name: messages_2025_11_06; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages_2025_11_06" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- TOC entry 406 (class 1259 OID 106527)
-- Name: messages_2025_11_07; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages_2025_11_07" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- TOC entry 420 (class 1259 OID 107164)
-- Name: messages_2025_11_08; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages_2025_11_08" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- TOC entry 376 (class 1259 OID 17554)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."schema_migrations" (
    "version" bigint NOT NULL,
    "inserted_at" timestamp(0) without time zone
);


--
-- TOC entry 377 (class 1259 OID 17557)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."subscription" (
    "id" bigint NOT NULL,
    "subscription_id" "uuid" NOT NULL,
    "entity" "regclass" NOT NULL,
    "filters" "realtime"."user_defined_filter"[] DEFAULT '{}'::"realtime"."user_defined_filter"[] NOT NULL,
    "claims" "jsonb" NOT NULL,
    "claims_role" "regrole" GENERATED ALWAYS AS ("realtime"."to_regrole"(("claims" ->> 'role'::"text"))) STORED NOT NULL,
    "created_at" timestamp without time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


--
-- TOC entry 378 (class 1259 OID 17565)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE "realtime"."subscription" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "realtime"."subscription_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 379 (class 1259 OID 17566)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autodetection" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" "text"[],
    "owner_id" "text",
    "type" "storage"."buckettype" DEFAULT 'STANDARD'::"storage"."buckettype" NOT NULL
);


--
-- TOC entry 4557 (class 0 OID 0)
-- Dependencies: 379
-- Name: COLUMN "buckets"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."buckets"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 389 (class 1259 OID 73408)
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets_analytics" (
    "id" "text" NOT NULL,
    "type" "storage"."buckettype" DEFAULT 'ANALYTICS'::"storage"."buckettype" NOT NULL,
    "format" "text" DEFAULT 'ICEBERG'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- TOC entry 380 (class 1259 OID 17575)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 381 (class 1259 OID 17579)
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bucket_id" "text",
    "name" "text",
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_accessed_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "path_tokens" "text"[] GENERATED ALWAYS AS ("string_to_array"("name", '/'::"text")) STORED,
    "version" "text",
    "owner_id" "text",
    "user_metadata" "jsonb",
    "level" integer
);


--
-- TOC entry 4558 (class 0 OID 0)
-- Dependencies: 381
-- Name: COLUMN "objects"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."objects"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 388 (class 1259 OID 73363)
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."prefixes" (
    "bucket_id" "text" NOT NULL,
    "name" "text" NOT NULL COLLATE "pg_catalog"."C",
    "level" integer GENERATED ALWAYS AS ("storage"."get_level"("name")) STORED NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


--
-- TOC entry 382 (class 1259 OID 17589)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."s3_multipart_uploads" (
    "id" "text" NOT NULL,
    "in_progress_size" bigint DEFAULT 0 NOT NULL,
    "upload_signature" "text" NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "version" "text" NOT NULL,
    "owner_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_metadata" "jsonb"
);


--
-- TOC entry 383 (class 1259 OID 17596)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."s3_multipart_uploads_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "upload_id" "text" NOT NULL,
    "size" bigint DEFAULT 0 NOT NULL,
    "part_number" integer NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "etag" "text" NOT NULL,
    "owner_id" "text",
    "version" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- TOC entry 3825 (class 0 OID 0)
-- Name: messages_2025_11_02; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_02" FOR VALUES FROM ('2025-11-02 00:00:00') TO ('2025-11-03 00:00:00');


--
-- TOC entry 3826 (class 0 OID 0)
-- Name: messages_2025_11_03; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_03" FOR VALUES FROM ('2025-11-03 00:00:00') TO ('2025-11-04 00:00:00');


--
-- TOC entry 3827 (class 0 OID 0)
-- Name: messages_2025_11_04; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_04" FOR VALUES FROM ('2025-11-04 00:00:00') TO ('2025-11-05 00:00:00');


--
-- TOC entry 3828 (class 0 OID 0)
-- Name: messages_2025_11_05; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_05" FOR VALUES FROM ('2025-11-05 00:00:00') TO ('2025-11-06 00:00:00');


--
-- TOC entry 3829 (class 0 OID 0)
-- Name: messages_2025_11_06; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_06" FOR VALUES FROM ('2025-11-06 00:00:00') TO ('2025-11-07 00:00:00');


--
-- TOC entry 3830 (class 0 OID 0)
-- Name: messages_2025_11_07; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_07" FOR VALUES FROM ('2025-11-07 00:00:00') TO ('2025-11-08 00:00:00');


--
-- TOC entry 3831 (class 0 OID 0)
-- Name: messages_2025_11_08; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_08" FOR VALUES FROM ('2025-11-08 00:00:00') TO ('2025-11-09 00:00:00');


--
-- TOC entry 3842 (class 2604 OID 17604)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass");


--
-- TOC entry 3852 (class 2604 OID 17605)
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."admin_users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."admin_users_id_seq"'::"regclass");


--
-- TOC entry 3906 (class 2604 OID 93015)
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."announcements" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."announcements_id_seq"'::"regclass");


--
-- TOC entry 3904 (class 2604 OID 90485)
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."attendance" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."attendance_id_seq"'::"regclass");


--
-- TOC entry 3949 (class 2604 OID 107181)
-- Name: grade_sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."grade_sections" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."grade_sections_id_seq"'::"regclass");


--
-- TOC entry 3856 (class 2604 OID 17607)
-- Name: login_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."login_logs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."login_logs_id_seq"'::"regclass");


--
-- TOC entry 4424 (class 0 OID 17420)
-- Dependencies: 354
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- TOC entry 4425 (class 0 OID 17426)
-- Dependencies: 355
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
\.


--
-- TOC entry 4426 (class 0 OID 17431)
-- Dependencies: 356
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
\.


--
-- TOC entry 4427 (class 0 OID 17438)
-- Dependencies: 357
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4428 (class 0 OID 17443)
-- Dependencies: 358
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
\.


--
-- TOC entry 4429 (class 0 OID 17448)
-- Dependencies: 359
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- TOC entry 4430 (class 0 OID 17453)
-- Dependencies: 360
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- TOC entry 4460 (class 0 OID 85759)
-- Dependencies: 392
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at") FROM stdin;
\.


--
-- TOC entry 4455 (class 0 OID 33503)
-- Dependencies: 387
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type") FROM stdin;
\.


--
-- TOC entry 4461 (class 0 OID 85792)
-- Dependencies: 393
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- TOC entry 4431 (class 0 OID 17458)
-- Dependencies: 361
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4432 (class 0 OID 17466)
-- Dependencies: 362
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
\.


--
-- TOC entry 4434 (class 0 OID 17472)
-- Dependencies: 364
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- TOC entry 4435 (class 0 OID 17480)
-- Dependencies: 365
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- TOC entry 4436 (class 0 OID 17486)
-- Dependencies: 366
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."schema_migrations" ("version") FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
\.


--
-- TOC entry 4437 (class 0 OID 17489)
-- Dependencies: 367
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter") FROM stdin;
\.


--
-- TOC entry 4438 (class 0 OID 17494)
-- Dependencies: 368
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4439 (class 0 OID 17500)
-- Dependencies: 369
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- TOC entry 4440 (class 0 OID 17506)
-- Dependencies: 370
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
\.


--
-- TOC entry 3820 (class 0 OID 106580)
-- Dependencies: 409
-- Data for Name: job; Type: TABLE DATA; Schema: cron; Owner: -
--

COPY "cron"."job" ("jobid", "schedule", "command", "nodename", "nodeport", "database", "username", "active", "jobname") FROM stdin;
4	0 10 * * 1-5	\r\n  SELECT net.http_post(\r\n    url := 'https://dieyszynhfhlplalfawk.supabase.co/functions/v1/auto-timeout',\r\n    headers := jsonb_build_object(\r\n      'Content-Type', 'application/json',\r\n      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZXlzenluaGZobHBsYWxmYXdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjIyNjk3MCwiZXhwIjoyMDY3ODAyOTcwfQ.wcupFhLE_Zrvk2iAd9Glc_3d1QU8E9RDWKijp7MOaEw'\r\n    )\r\n  ) as request_id;\r\n  	localhost	5432	postgres	postgres	t	auto-timeout-daily
\.


--
-- TOC entry 3822 (class 0 OID 106599)
-- Dependencies: 411
-- Data for Name: job_run_details; Type: TABLE DATA; Schema: cron; Owner: -
--

COPY "cron"."job_run_details" ("jobid", "runid", "job_pid", "database", "username", "command", "status", "return_message", "start_time", "end_time") FROM stdin;
4	3	3155645	postgres	postgres	\r\n  SELECT net.http_post(\r\n    url := 'https://dieyszynhfhlplalfawk.supabase.co/functions/v1/auto-timeout',\r\n    headers := jsonb_build_object(\r\n      'Content-Type', 'application/json',\r\n      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZXlzenluaGZobHBsYWxmYXdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjIyNjk3MCwiZXhwIjoyMDY3ODAyOTcwfQ.wcupFhLE_Zrvk2iAd9Glc_3d1QU8E9RDWKijp7MOaEw'\r\n    )\r\n  ) as request_id;\r\n  	succeeded	1 row	2025-11-07 10:00:00.188108+00	2025-11-07 10:00:00.242744+00
4	1	3056754	postgres	postgres	\r\n  SELECT net.http_post(\r\n    url := 'https://dieyszynhfhlplalfawk.supabase.co/functions/v1/auto-timeout',\r\n    headers := jsonb_build_object(\r\n      'Content-Type', 'application/json',\r\n      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZXlzenluaGZobHBsYWxmYXdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjIyNjk3MCwiZXhwIjoyMDY3ODAyOTcwfQ.wcupFhLE_Zrvk2iAd9Glc_3d1QU8E9RDWKijp7MOaEw'\r\n    )\r\n  ) as request_id;\r\n  	succeeded	1 row	2025-11-05 10:00:00.225314+00	2025-11-05 10:00:00.273618+00
4	2	3104772	postgres	postgres	\r\n  SELECT net.http_post(\r\n    url := 'https://dieyszynhfhlplalfawk.supabase.co/functions/v1/auto-timeout',\r\n    headers := jsonb_build_object(\r\n      'Content-Type', 'application/json',\r\n      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZXlzenluaGZobHBsYWxmYXdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjIyNjk3MCwiZXhwIjoyMDY3ODAyOTcwfQ.wcupFhLE_Zrvk2iAd9Glc_3d1QU8E9RDWKijp7MOaEw'\r\n    )\r\n  ) as request_id;\r\n  	succeeded	1 row	2025-11-06 10:00:00.202104+00	2025-11-06 10:00:00.247876+00
4	4	3299130	postgres	postgres	\r\n  SELECT net.http_post(\r\n    url := 'https://dieyszynhfhlplalfawk.supabase.co/functions/v1/auto-timeout',\r\n    headers := jsonb_build_object(\r\n      'Content-Type', 'application/json',\r\n      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZXlzenluaGZobHBsYWxmYXdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjIyNjk3MCwiZXhwIjoyMDY3ODAyOTcwfQ.wcupFhLE_Zrvk2iAd9Glc_3d1QU8E9RDWKijp7MOaEw'\r\n    )\r\n  ) as request_id;\r\n  	succeeded	1 row	2025-11-10 10:00:00.18984+00	2025-11-10 10:00:00.231841+00
\.


--
-- TOC entry 4441 (class 0 OID 17521)
-- Dependencies: 371
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."admin_users" ("id", "username", "password_hash", "role", "is_active", "created_at") FROM stdin;
63	admin	$2b$10$Sjso5BmrfShYxxTPGUHzpODIW3uX0fweenQPZP/Skcb3qc56MtGqy	administrator	t	2025-10-23 07:35:44.117103
\.


--
-- TOC entry 4466 (class 0 OID 93012)
-- Dependencies: 399
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."announcements" ("id", "title", "content", "created_at", "updated_at") FROM stdin;
13	System Integration Announcement	We are pleased to announce that this November 3, our Student Attendance Management System (SAMS) will be officially integrated into Ampid 1 Elementary School. This system aims to modernize and streamline student attendance tracking, ensuring accuracy, efficiency, and transparency in daily attendance records.\n\nThrough SAMS, teachers and administrators can easily manage attendance reports, while parents can stay informed about their child’s attendance status. This integration marks an important step toward digital transformation in our school’s record management.	2025-11-02 11:49:40.6995+00	2025-11-02 11:59:46.055768+00
17	RELEASE MOBILE APPLICATION	RELEASING OF MOBILE APPLICATION  NOVEMBER 10, 2025	2025-11-05 07:01:15.418162+00	2025-11-07 08:19:49.325098+00
\.


--
-- TOC entry 4464 (class 0 OID 90482)
-- Dependencies: 397
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."attendance" ("id", "student_id", "attendance_date", "status", "notes", "recorded_by", "recorded_at") FROM stdin;
\.


--
-- TOC entry 4474 (class 0 OID 106543)
-- Dependencies: 407
-- Data for Name: auto_timeout_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."auto_timeout_logs" ("id", "rfid", "original_time_in", "auto_timeout_timestamp", "inserted_log_id", "created_at", "notes") FROM stdin;
617696a8-0e7e-4c05-a378-7913c6594133	0308372745	2025-11-04 03:23:02.98+00	2025-11-04 10:00:00+00	0cf27bb3-fba8-4912-bf95-52306057a2ad	2025-11-04 10:24:34.740648+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
1460fb4a-d476-41fc-9f3d-bcd139a722f0	0298837641	2025-11-04 03:23:19.289+00	2025-11-04 10:00:00+00	180e9a83-88c8-46a5-b650-f9990cfa8709	2025-11-04 10:24:34.8449+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
3c3d2c76-a253-44cc-b4d7-c3ebb598aa48	0296807385	2025-11-04 03:41:16.549+00	2025-11-04 10:00:00+00	ef72a04b-86c6-417e-b19f-6b7bd12b6b14	2025-11-04 10:24:34.945061+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
63cdf390-35ed-46b2-9536-626024d9563d	0291973721	2025-11-04 03:41:30.585+00	2025-11-04 10:00:00+00	5a39ba52-8215-428b-9cdc-67499baca47a	2025-11-04 10:24:35.04547+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
3607981a-57e2-4ded-aecc-58790ed685c3	0309182473	2025-11-04 03:52:13.273+00	2025-11-04 10:00:00+00	e875a7f4-eb08-4fc5-97c9-b9f8ea138cbf	2025-11-04 10:24:35.136385+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
cb1033bd-4bba-4687-a053-15b5fa816b75	0308432841	2025-11-04 03:52:18.544+00	2025-11-04 10:00:00+00	c3cd197d-9c2d-415a-9271-861b027e25c7	2025-11-04 10:24:35.236887+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
1f29f4bc-1645-4592-9072-fc466e85d3e9	0308039577	2025-11-04 03:53:30.666+00	2025-11-04 10:00:00+00	905cfc14-1d5b-45f1-9d5b-d14da2237957	2025-11-04 10:24:35.334932+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
b29f91e8-cce0-47cc-a06b-fd7f57cb2a9f	0298967657	2025-11-04 03:54:52.01+00	2025-11-04 10:00:00+00	8834fd80-ff66-445c-9d06-9b8f0af34a9e	2025-11-04 10:24:35.427644+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
a84a934a-0a30-4d57-a3c4-13a929e1ff54	0292301481	2025-11-04 04:10:48.898+00	2025-11-04 10:00:00+00	0dbc7872-94ac-43f3-ac69-165719a54e69	2025-11-04 10:24:35.528003+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
952515c6-8a1d-4123-9030-afb51f92a869	0304628105	2025-11-05 07:16:31.31+00	2025-11-05 10:00:00+00	35ed5180-d8e2-455a-ba7d-0f755f6cd663	2025-11-05 10:00:03.593093+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7243ea0f-4396-45de-974d-d99403c67685	1100979479	2025-11-06 04:31:07.86+00	2025-11-06 10:00:00+00	40e0cbfe-8beb-43c8-8115-93a9a2aa36db	2025-11-06 10:00:04.53197+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
982aded7-e7c6-460b-ae95-56aabf9745e7	0305101593	2025-11-06 04:31:02.306+00	2025-11-06 10:00:00+00	a26e61a9-c5ba-48b8-8039-468e85064ce8	2025-11-06 10:00:04.694332+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
e7d25391-1183-4f1b-8315-9f01030fdff3	0297377865	2025-11-06 04:30:51.199+00	2025-11-06 10:00:00+00	722c558c-d33b-42ca-b457-e3c3bf7e053e	2025-11-06 10:00:04.836115+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
cd606b14-4eae-4bfc-85d9-ceb856e5379d	0291955241	2025-11-06 04:30:46.572+00	2025-11-06 10:00:00+00	cd19de82-1c3c-4e39-9d02-65338d1a4fc7	2025-11-06 10:00:04.953906+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
02203068-6b7a-4af1-99cd-9a67ab3382c4	0299103609	2025-11-06 04:30:39.079+00	2025-11-06 10:00:00+00	1e4adf8a-9378-4315-8ad2-6a2720114b97	2025-11-06 10:00:05.071817+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
83811465-0301-4671-92cc-d1f6ae232a74	0294884089	2025-11-06 04:28:29.655+00	2025-11-06 10:00:00+00	1be7e29f-33b1-4d48-92ad-60536956b458	2025-11-06 10:00:05.167653+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ae3f433c-7f94-4674-badc-3cd8de0ce022	0295114121	2025-11-06 04:28:26.833+00	2025-11-06 10:00:00+00	317db771-3e81-43f4-8f72-615e8942162e	2025-11-06 10:00:05.242645+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
bc77cce9-ff71-4068-9406-133b4baf7784	0296836713	2025-11-06 04:28:24.283+00	2025-11-06 10:00:00+00	12e369d9-490f-4a58-b628-67108ea2d777	2025-11-06 10:00:05.308879+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
0e8d7d95-2283-4b06-9b93-3d88d408c478	1100972749	2025-11-06 04:28:20.394+00	2025-11-06 10:00:00+00	f05be294-98c5-4990-a3ac-73c603645c2a	2025-11-06 10:00:05.368699+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
29516560-26d9-4cbc-a9f2-063ad8888779	0294788905	2025-11-06 04:28:16.397+00	2025-11-06 10:00:00+00	c9015fb4-f82a-4661-afa4-acedd12688d0	2025-11-06 10:00:05.437875+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
b7c91211-3c98-4189-8b09-4d1aa4ac8a3c	0298966905	2025-11-06 04:28:01.834+00	2025-11-06 10:00:00+00	8798d502-b635-4430-a709-62b3c79b4de6	2025-11-06 10:00:05.502549+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
c5fbd99a-9678-4016-84be-4b5b82856a43	0292210489	2025-11-06 04:26:23.027+00	2025-11-06 10:00:00+00	e286813c-4f0f-41ad-a7d1-9e53464279db	2025-11-06 10:00:05.563505+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
30d86e7e-025a-4e16-bbf2-5aa1ba4cd031	0308039577	2025-11-06 04:26:13.355+00	2025-11-06 10:00:00+00	89592848-d70c-49c6-a91c-87dcf8fbe785	2025-11-06 10:00:05.634455+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
add433a6-da62-4054-9753-843e2275b123	0308432841	2025-11-06 04:26:10.17+00	2025-11-06 10:00:00+00	27664a99-d491-497a-bf1f-35f2e8a6610a	2025-11-06 10:00:05.713806+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
cc2ce527-874c-4548-9df3-859943f6f1f7	0298967657	2025-11-06 04:26:08.202+00	2025-11-06 10:00:00+00	557604e0-70e4-4ab0-a8c6-e80fda20c914	2025-11-06 10:00:05.829612+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
14309edf-b8d2-4119-81c8-a1c73fb68158	0309182473	2025-11-06 04:26:06.291+00	2025-11-06 10:00:00+00	37971977-c98a-4160-ac44-6503e7fe7572	2025-11-06 10:00:05.967498+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
1591a315-6b8f-4553-9864-4847a99b1ac2	0292424393	2025-11-06 04:26:04.222+00	2025-11-06 10:00:00+00	e3042791-eda7-4ad2-8cdd-2d1680b7dd91	2025-11-06 10:00:06.085058+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
8173d370-b5c6-4d28-ad54-1651b23f7319	0292301481	2025-11-06 03:21:23.259+00	2025-11-06 10:00:00+00	489e59d4-0909-4dab-be02-2ee6b200f7f4	2025-11-06 10:00:06.188144+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
5ad6a76e-7220-4dce-a3fa-d0e7441247f7	0298865209	2025-11-07 07:46:50.906+00	2025-11-07 10:00:00+00	080f7eed-b8c8-4c16-a8ee-f033924a854c	2025-11-07 10:00:03.027281+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
518bbf31-c541-4e65-a5a5-577823f32b80	0292692057	2025-11-07 07:45:40.517+00	2025-11-07 10:00:00+00	d278bde2-5074-4f41-8481-f1bf33996cca	2025-11-07 10:00:03.16113+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
28b47174-978c-4f29-aabe-b77496178946	0308372953	2025-11-07 07:45:27.393+00	2025-11-07 10:00:00+00	e8135407-84a8-435c-bed8-68f3ce87e882	2025-11-07 10:00:03.257151+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
2b142ede-aded-4724-a5b7-7ae595c4b092	0299045273	2025-11-07 07:44:10.39+00	2025-11-07 10:00:00+00	fe625498-30ad-4cf1-a804-070f5e3f910d	2025-11-07 10:00:03.361581+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
a34d4bbf-4f13-401f-8c8b-778106e2a7d7	0294962649	2025-11-07 07:44:06.917+00	2025-11-07 10:00:00+00	152e4021-5186-4eed-b8ac-70d495a82dc2	2025-11-07 10:00:03.458225+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
5e771fe3-4870-4bb8-b8db-410c49ef65bf	0309210105	2025-11-07 07:42:49.647+00	2025-11-07 10:00:00+00	e91a920f-b0b5-43e3-8fa5-48b14e100e0b	2025-11-07 10:00:03.615728+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
d315376b-b72b-40c0-87ce-a8aad85cbcb8	0309266489	2025-11-07 07:42:13.259+00	2025-11-07 10:00:00+00	c948893f-e7ee-4db1-bd14-4212954a1c10	2025-11-07 10:00:03.703848+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
108a75b6-7080-4944-88cd-a866a2fefaeb	0294935401	2025-11-07 07:40:44.818+00	2025-11-07 10:00:00+00	f61d7c78-183b-441f-83ba-f081b8d3c48b	2025-11-07 10:00:03.824679+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
40b01985-6664-4c92-b443-a7873e8023e3	0306344873	2025-11-07 07:40:23.818+00	2025-11-07 10:00:00+00	38c02f6d-7651-48aa-8890-7fadc178381d	2025-11-07 10:00:03.960045+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
2a1fdd74-da54-41ac-b785-1a89566bf13c	0305765241	2025-11-07 07:39:35.021+00	2025-11-07 10:00:00+00	31291ebf-cae1-4a8a-b0c5-8a8a817764ac	2025-11-07 10:00:04.109845+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
5f6b8a8e-d3a1-40a3-b35d-78e77245a972	0304192553	2025-11-07 07:38:02.228+00	2025-11-07 10:00:00+00	b5ca8879-05c4-45a1-84bb-bfa2d06c3c18	2025-11-07 10:00:04.162806+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
a88e315f-6923-49f8-926c-d9d9ca941b9f	0294896521	2025-11-07 07:37:59.799+00	2025-11-07 10:00:00+00	504b5df6-b700-4164-8fee-e5cde860c547	2025-11-07 10:00:04.235979+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
313dc38c-f0ae-4e9d-ba8e-5ccfb7fdb1a5	0310046601	2025-11-07 07:34:10.496+00	2025-11-07 10:00:00+00	0480b5eb-7b2f-4141-a7f2-04868350907e	2025-11-07 10:00:04.339328+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
8851cd9b-a5cd-457b-b74c-5ad314a16f87	0292916473	2025-11-07 07:32:19.928+00	2025-11-07 10:00:00+00	2fa39d95-b0c5-4905-abc1-62ab4503d843	2025-11-07 10:00:04.398776+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
9d4c7d05-f126-45ba-80a7-d7298668ac46	0310126089	2025-11-07 07:30:40.17+00	2025-11-07 10:00:00+00	3f1699b7-bc38-44fb-828e-d12f7c521561	2025-11-07 10:00:05.013282+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
b154b487-2c03-4f6b-ad32-fb06bf4dc9db	0117175945	2025-11-07 07:28:42.076+00	2025-11-07 10:00:00+00	6f650022-e300-441a-b103-70e4eace247e	2025-11-07 10:00:05.091409+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
6e4467c2-5a8b-42b2-bf17-c36fe3c941a8	0300983209	2025-11-07 07:27:48.085+00	2025-11-07 10:00:00+00	70f68a55-6754-4a38-93a3-8709dbb9a524	2025-11-07 10:00:05.14802+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
a810a45b-e5f8-4ba1-90b1-950570ac819d	0293119129	2025-11-07 07:26:33.114+00	2025-11-07 10:00:00+00	34272128-ae4e-4f02-92a1-3c144d6feae8	2025-11-07 10:00:05.324754+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
855f2bdf-30a8-4050-b71b-9337bbc212be	0305697017	2025-11-07 07:24:14.755+00	2025-11-07 10:00:00+00	0d9f4a1c-6d0f-4765-8b65-f98e89373043	2025-11-07 10:00:05.391982+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
9a302967-5717-4774-bfef-f295f71a5852	0299130425	2025-11-07 07:21:33.954+00	2025-11-07 10:00:00+00	6274bef1-cf68-4c83-b8b2-ea716e214b02	2025-11-07 10:00:05.461226+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
8f26c7b0-04a3-4c62-bd6d-9be3d0d80e0f	0300924777	2025-11-07 07:16:02.663+00	2025-11-07 10:00:00+00	d4118e8c-1828-4a90-b1b5-9777d9f85f4d	2025-11-07 10:00:05.635273+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
0ec5134a-e66c-4a77-b0a1-72a8e917276f	0305692953	2025-11-07 07:10:17.135+00	2025-11-07 10:00:00+00	e590cc27-42aa-492b-a404-041fb0ffbc41	2025-11-07 10:00:05.81617+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
eb70992b-2d41-4747-a3d5-7f797d9b5fea	0306985785	2025-11-07 07:06:10.436+00	2025-11-07 10:00:00+00	23b0e56f-ab39-42a1-91a2-637dc07e52fe	2025-11-07 10:00:05.999399+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
86d28375-8517-4ce8-a7f3-eacc210b78c0	0292308905	2025-11-07 06:59:14.516+00	2025-11-07 10:00:00+00	4384cdce-babf-43b2-a005-2a4a8ed66559	2025-11-07 10:00:06.184955+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
47eded76-40cd-483a-bf5a-6fcba26b0b89	0299103609	2025-11-07 06:58:38.647+00	2025-11-07 10:00:00+00	af0b8cd0-ac86-463c-b1cf-d1ed484eae9c	2025-11-07 10:00:06.38392+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
e234504c-1c72-4bc4-a9f9-349f12240e53	0297385625	2025-11-07 06:54:53.142+00	2025-11-07 10:00:00+00	9b7fef96-0f1d-4e4e-b7be-fc5be65e4d06	2025-11-07 10:00:06.575296+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
dafb39de-5b9e-48f6-a986-ad005230c781	0305445241	2025-11-07 06:54:43.047+00	2025-11-07 10:00:00+00	f0e64e57-9431-4d90-9b9a-fa8df706d690	2025-11-07 10:00:06.766589+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
d539dc76-a081-4d62-885c-fc5e20ed8715	0298967657	2025-11-07 06:54:32.495+00	2025-11-07 10:00:00+00	bb78b14f-d944-40fb-93d9-b027f7123014	2025-11-07 10:00:06.972353+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
411c93b5-b5bb-448c-abf3-28fe5a8cc689	0296807385	2025-11-07 06:54:27.047+00	2025-11-07 10:00:00+00	6a2c06fa-a65b-4dfb-86bf-29aaa2f6159c	2025-11-07 10:00:07.148312+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
0d170a8d-3952-453a-a3ba-737162d41efa	0308432841	2025-11-07 06:54:19.02+00	2025-11-07 10:00:00+00	a3b570ec-ada6-4f1c-be5c-342eec8326a9	2025-11-07 10:00:07.348651+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
cb07024e-db39-46a2-8b46-675d6e005877	0308561833	2025-11-07 06:53:12.338+00	2025-11-07 10:00:00+00	71f973d4-7571-4dcb-bf5e-d59248e67cbc	2025-11-07 10:00:07.551314+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
d375b950-70b5-4a39-84ca-53948c3da5cc	0293050969	2025-11-07 06:51:39.186+00	2025-11-07 10:00:00+00	b84fbcae-3daf-40b0-81d2-a225406a8f4e	2025-11-07 10:00:07.726328+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
25bfa752-e1ca-4eee-8a61-0779423b08c4	0307577945	2025-11-07 06:45:20.475+00	2025-11-07 10:00:00+00	85530e3f-8140-488a-a256-113820c3e062	2025-11-07 10:00:07.888682+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
f0a94c8e-ef09-4349-aeb3-29719a3e1b4d	0299315913	2025-11-07 06:43:26.119+00	2025-11-07 10:00:00+00	9b6a74e6-52c7-407e-add5-42bbdc23a8fb	2025-11-07 10:00:08.08286+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
86ec250c-9b5e-4132-8292-e113a2fcfc6b	0305727129	2025-11-07 06:41:45.685+00	2025-11-07 10:00:00+00	c60e7d1c-e0c8-4301-8d2d-1e4584f85103	2025-11-07 10:00:08.295854+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
09178678-43fd-439b-adbd-4197c993dba8	0293022537	2025-11-07 06:40:42.179+00	2025-11-07 10:00:00+00	2bcaaf78-a509-4bac-b2a3-137da7a1f6f0	2025-11-07 10:00:08.502383+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
f9aa9262-7d89-441d-a183-021bcdfe8412	0291865289	2025-11-07 06:39:27.674+00	2025-11-07 10:00:00+00	bdb207b6-22d1-4269-ac6b-31f608e468b0	2025-11-07 10:00:08.701321+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7700d3b9-4c67-4bdd-acaf-6c9e25cab160	0298922889	2025-11-07 06:37:33.795+00	2025-11-07 10:00:00+00	1b6d1897-8245-4e46-aa79-cef78a9333dc	2025-11-07 10:00:08.871437+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
be495ed0-1ed2-40b5-bf94-746ed30b0046	0308301369	2025-11-07 06:36:39.704+00	2025-11-07 10:00:00+00	99eeb224-6795-414d-aeb4-86be937589b3	2025-11-07 10:00:09.05588+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
970e1c6a-6c4b-4d08-bb79-9e7167f5299a	0305588489	2025-11-07 06:35:08.838+00	2025-11-07 10:00:00+00	22b954be-813b-45da-b270-f45e9a7d0687	2025-11-07 10:00:09.232337+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
37695381-ae77-4433-8dc9-46f0f1a1bc78	0309725945	2025-11-07 06:32:41.892+00	2025-11-07 10:00:00+00	6e6e7cfe-57f8-45e6-b8df-7d8598ee6bb6	2025-11-07 10:00:09.413657+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
3d832e50-e5a4-4f39-aeae-c3204fcbf237	0305499433	2025-11-07 06:31:10.815+00	2025-11-07 10:00:00+00	84dad0c3-6bf5-47a6-85ee-91862acad427	2025-11-07 10:00:09.614388+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
b798713e-55dd-465f-8f3e-08cd830bb88d	0308566713	2025-11-07 06:30:17.701+00	2025-11-07 10:00:00+00	99be5878-122b-4de2-800d-dcd9dbb9ec2c	2025-11-07 10:00:09.814567+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ef4f3730-7b66-46fd-9bc5-a3183e899f6f	0296836713	2025-11-07 06:28:51.536+00	2025-11-07 10:00:00+00	8676748b-31fc-420e-a591-81eabcf83afb	2025-11-07 10:00:10.104837+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ef4c5fc9-4da5-4c08-9238-d3bcdb3b0374	0305101593	2025-11-07 06:28:40.5+00	2025-11-07 10:00:00+00	cebdbb53-f47f-4b9f-a1c3-29b2d5d88810	2025-11-07 10:00:10.297412+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
38f1b1dd-fdc6-4099-9e1f-36d14e3d1aac	1100979479	2025-11-07 06:28:34.222+00	2025-11-07 10:00:00+00	d55db8c5-1151-4b41-8f1c-b192008da4a9	2025-11-07 10:00:10.45584+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
31bfe35f-702a-48e7-a340-76ec1fd0a7b5	0296634233	2025-11-07 05:35:58.081+00	2025-11-07 10:00:00+00	172c45b6-f17e-4297-b834-2d4848a1254b	2025-11-07 10:00:10.907378+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
b84497d6-5989-46f4-914e-4f6ea4c25992	0304953593	2025-11-07 04:35:02.834+00	2025-11-07 10:00:00+00	9d39197e-8e36-4814-91b1-a83b1bee5e62	2025-11-07 10:00:11.104619+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7ffc59af-07a3-4855-a2d7-aeba76282f89	0307877113	2025-11-07 04:34:05.947+00	2025-11-07 10:00:00+00	9acc4a37-3c28-439b-8421-a88c53581530	2025-11-07 10:00:11.309616+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
13fa54a7-a489-4f46-8d2b-5ac6d8ce8b8b	0308477257	2025-11-07 04:17:00.308+00	2025-11-07 10:00:00+00	41ad65c2-dfc4-4a85-8165-b37c4bc37bad	2025-11-07 10:00:11.556317+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
1d66c9c9-67ca-4a87-8dd7-f4955322faa3	0308557449	2025-11-07 04:15:36.244+00	2025-11-07 10:00:00+00	56773628-bde6-428c-b19e-72e9bed90aca	2025-11-07 10:00:11.744722+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
55c60036-35fb-407d-91ff-61bdd18aed66	0306322841	2025-11-07 04:13:23.674+00	2025-11-07 10:00:00+00	6bce0f24-7d93-46f3-9c23-c39048a81115	2025-11-07 10:00:11.926652+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
2bcf6bff-e9d1-4763-a7a6-77e1ecbd83e1	0306022393	2025-11-07 04:08:42.564+00	2025-11-07 10:00:00+00	25063de6-45ed-4142-84c0-920d9b8aa5bb	2025-11-07 10:00:12.129625+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
40a96b96-c24c-4975-86f1-366d93476bc6	0307406985	2025-11-07 04:07:15.303+00	2025-11-07 10:00:00+00	684a23d3-7c1a-4e80-8cfd-2ef24aeef8b5	2025-11-07 10:00:12.302632+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
15e649ff-6478-4774-8651-7e07ca4bc0f7	0309574841	2025-11-07 04:06:08.51+00	2025-11-07 10:00:00+00	a278dfbb-8456-404e-b648-5450f99c920b	2025-11-07 10:00:12.462347+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
25583c9b-b48d-46d4-9ee0-dff017215674	0305570809	2025-11-07 04:03:12.192+00	2025-11-07 10:00:00+00	bfc39a36-7706-418e-9040-96c5ee20591d	2025-11-07 10:00:12.626935+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
bc1f2d3e-0402-4276-b521-9b370d50a105	0297633897	2025-11-07 04:01:47.156+00	2025-11-07 10:00:00+00	7d189dcf-6f3e-4e56-8a44-ea16327d697f	2025-11-07 10:00:12.853365+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
8f9472b0-767b-429d-9d01-29e97e607360	0306301449	2025-11-07 04:00:06.648+00	2025-11-07 10:00:00+00	233abf66-d089-493a-8e1f-14ca71498897	2025-11-07 10:00:13.031224+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
33e3e905-bcf4-4035-b48b-d48e5d5019d5	0298255273	2025-11-07 03:58:49.205+00	2025-11-07 10:00:00+00	5ec536bc-2696-4aa6-8949-c8fa27122798	2025-11-07 10:00:13.185588+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ea54b542-6683-451a-a72f-63cb78a21a9a	0306494617	2025-11-07 03:56:41.741+00	2025-11-07 10:00:00+00	b6c2a8dd-bf1c-45f4-a673-844dca95c404	2025-11-07 10:00:13.346498+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
36655a5c-f8d1-47b0-b020-648e8a163511	0113246345	2025-11-07 03:54:54.858+00	2025-11-07 10:00:00+00	84f6b51d-7b7b-4df4-8392-e79a33901a04	2025-11-07 10:00:13.518357+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
8086348b-1476-4a8c-99b3-5c9e617ce48d	0296861817	2025-11-07 03:53:29.868+00	2025-11-07 10:00:00+00	37e076a1-02a9-421a-b83b-9a8fd1db4c8f	2025-11-07 10:00:13.702801+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
05c04e92-32f3-401c-a95b-b1c51ee1d41a	0297578969	2025-11-07 03:51:39.917+00	2025-11-07 10:00:00+00	1d33f4a0-147b-4086-8c2e-fcb6c0a7c18d	2025-11-07 10:00:13.868253+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7ae94155-6726-4cf7-b7de-53a695fb64f6	0117272745	2025-11-07 03:49:59.545+00	2025-11-07 10:00:00+00	82cf0f5b-0b1d-49f2-a5c5-b9e354883c2a	2025-11-07 10:00:14.065995+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
31809848-c542-4ab4-b681-4b28cf6a0bf6	0298282009	2025-11-07 03:48:10.769+00	2025-11-07 10:00:00+00	83ef98f6-158a-4147-bf8e-9dbe026603ee	2025-11-07 10:00:14.244756+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
1a0f03f3-eaca-4c6d-a5db-b985afa0db8d	0112899417	2025-11-07 03:46:47.966+00	2025-11-07 10:00:00+00	0e8c38ad-dead-40aa-8d86-d48ad9551a76	2025-11-07 10:00:14.45719+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
417a9853-bdd7-4f70-b582-1ce36a2c3221	0299308185	2025-11-07 07:18:45.794+00	2025-11-07 10:00:00+00	8a19bcf8-b270-4c0d-bbbb-b39418cc966e	2025-11-07 10:00:05.525748+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
155ad55b-a836-4d98-b10c-73f027d8dca4	0305378185	2025-11-07 07:15:04.6+00	2025-11-07 10:00:00+00	dfe985b3-aae2-4fa7-a0cf-bf1e3fc36e9a	2025-11-07 10:00:05.688516+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
9116aa2e-1d0c-4c15-8465-e43d4be5451f	0305382537	2025-11-07 07:08:52.255+00	2025-11-07 10:00:00+00	9481acb1-8805-4004-94a2-2644185b9f75	2025-11-07 10:00:05.882148+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7d70b11d-4a70-445a-b082-a655cbbafc88	0298117273	2025-11-07 07:04:36.286+00	2025-11-07 10:00:00+00	632bdb0f-1ebf-448f-ab82-b573240eba2d	2025-11-07 10:00:06.060893+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
458d3c0e-fc60-44ae-8361-b5f051fb7906	0291955241	2025-11-07 06:58:47.464+00	2025-11-07 10:00:00+00	2d196ea0-7a05-43ce-8a33-1a4378999a33	2025-11-07 10:00:06.25427+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
0335a883-0fbd-4ac2-9f8c-8a7841e2c5d3	0299325577	2025-11-07 06:55:16.09+00	2025-11-07 10:00:00+00	d510cec9-c3f0-476a-ad1c-1a74f531cc4b	2025-11-07 10:00:06.453581+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
450db433-0471-4f98-88d5-2a2e62fdb434	0291673481	2025-11-07 06:54:50.014+00	2025-11-07 10:00:00+00	6c094e3b-847f-40db-a0e1-4a0712cbf5c9	2025-11-07 10:00:06.643029+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
92bf62b6-b86d-49d7-bb48-8c5f4792e9c9	0292210489	2025-11-07 06:54:38.268+00	2025-11-07 10:00:00+00	4aef55cd-b2f0-4f28-8962-fd016e9918a3	2025-11-07 10:00:06.833732+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
11e0b8a9-90c9-463f-b2d6-01dd840cb99f	0292424393	2025-11-07 06:54:29.644+00	2025-11-07 10:00:00+00	2870f741-abbb-454d-9a33-45c94b8d62c8	2025-11-07 10:00:07.021162+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
18e3c90a-d6e3-47ee-985e-0412615e7774	0308039577	2025-11-07 06:54:23.974+00	2025-11-07 10:00:00+00	0354b749-8c24-462a-b92d-2c1467329661	2025-11-07 10:00:07.209775+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
e1cf6cff-f212-4410-8ceb-1bf6227fe63d	0298838281	2025-11-07 06:54:11.456+00	2025-11-07 10:00:00+00	dabadfb0-79a3-410c-a710-22cd4c0ba8fa	2025-11-07 10:00:07.42546+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
9e1c271e-f686-4923-b21c-ad1825d88e2d	0309630361	2025-11-07 06:52:28.194+00	2025-11-07 10:00:00+00	2501ca70-2792-4980-969b-2880ffeb51a7	2025-11-07 10:00:07.606973+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
33858146-3a54-4ebe-b8e9-b6d4405e2fd1	0309301033	2025-11-07 06:50:29.465+00	2025-11-07 10:00:00+00	40b75641-8051-4443-a9e1-507f6272c922	2025-11-07 10:00:07.779907+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
15c0a54b-52d7-4279-9889-dbdd3594224c	0310215897	2025-11-07 06:44:33.343+00	2025-11-07 10:00:00+00	9f497805-73d4-4657-8311-caeedea70225	2025-11-07 10:00:07.947517+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
6b6ab760-9438-4383-8310-bb7c182f4fa6	0299534281	2025-11-07 06:42:32.505+00	2025-11-07 10:00:00+00	2a8e1c81-45a8-4465-89e8-5db88613ceac	2025-11-07 10:00:08.164923+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7a847f85-8778-4386-93dc-6563705101e4	0299296473	2025-11-07 06:41:45.555+00	2025-11-07 10:00:00+00	43c42947-4923-414b-b512-abf2694cb06c	2025-11-07 10:00:08.371608+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
3efe6ce6-9f7b-460d-a3c7-e8d9ddb01775	0299046841	2025-11-07 06:40:16.663+00	2025-11-07 10:00:00+00	57a1de99-05b9-4a56-bf54-a1bd099b0cb9	2025-11-07 10:00:08.579967+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
5e500056-df87-4361-b3d8-aa10f7e8e32e	0308506473	2025-11-07 06:38:39.808+00	2025-11-07 10:00:00+00	1ad03cf2-023e-415b-9093-d8061f884212	2025-11-07 10:00:08.759322+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
c157ee72-6604-4d3e-812b-0b5335f5d824	0308578201	2025-11-07 06:37:23.559+00	2025-11-07 10:00:00+00	3602d707-29d8-49b6-847a-bd163d89f1c5	2025-11-07 10:00:08.931383+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
08b0b723-6273-421d-b2f8-b3b537c2b4d6	0308018329	2025-11-07 06:36:01.752+00	2025-11-07 10:00:00+00	820a6786-a0c2-4d9f-8997-a88d5047818d	2025-11-07 10:00:09.124873+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
c2aaf52f-9915-4674-9dbc-3a5b14cb19c5	0309377641	2025-11-07 06:34:10.034+00	2025-11-07 10:00:00+00	93d645a6-8d5b-4454-946b-654ba5141eab	2025-11-07 10:00:09.300179+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
5b102da8-5402-490e-91ac-7ec9c3b7faa9	0293000713	2025-11-07 06:32:37.345+00	2025-11-07 10:00:00+00	0833c746-a88b-4ec9-bac7-bb4a40c39974	2025-11-07 10:00:09.483395+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
132b1db1-ff87-40c3-b4e5-baba4243f16b	0305499433	2025-11-07 06:31:10.004+00	2025-11-07 10:00:00+00	8796ded1-455e-49e4-badc-8d107f360a5f	2025-11-07 10:00:09.697857+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
8916c90e-98ea-4f1c-b65d-2029def0d677	0295114121	2025-11-07 06:28:55.706+00	2025-11-07 10:00:00+00	56fc7e7d-b859-442d-bc24-13c83f503c1b	2025-11-07 10:00:09.901961+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
2eb97330-c8c8-488c-80a4-d559dffd2caf	1100972749	2025-11-07 06:28:48.35+00	2025-11-07 10:00:00+00	1714c33a-af15-4195-befc-1529536581e8	2025-11-07 10:00:10.173886+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
8bf5995c-8cb1-40e2-9766-ba7c71c4bff1	0309381401	2025-11-07 06:28:37.367+00	2025-11-07 10:00:00+00	527f1643-1b43-4b20-9ed2-e6ad9f68eebc	2025-11-07 10:00:10.348593+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
01f26ddb-3dc9-4e77-883d-90d2e35fd2b4	0294788905	2025-11-07 06:28:30.158+00	2025-11-07 10:00:00+00	088e50bb-d50d-4bb6-b853-cddd12d4ba4d	2025-11-07 10:00:10.510359+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
eb642569-c8c8-445e-9405-14a2b9a13d14	0296852729	2025-11-07 05:35:56.512+00	2025-11-07 10:00:00+00	bda34108-8e16-4cc5-8a75-0559701c14b5	2025-11-07 10:00:10.982917+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
e8b5499e-1501-4778-9a4f-33c40b20c53b	0294859689	2025-11-07 04:34:14.24+00	2025-11-07 10:00:00+00	27c457e4-aa1a-40bb-948c-e2069678273e	2025-11-07 10:00:11.156689+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
a83cd3f9-fd27-4b69-89d2-1ef2fb0bf01f	0299009897	2025-11-07 04:33:02.852+00	2025-11-07 10:00:00+00	91c566c1-ee98-4898-8f89-7bdb5169955b	2025-11-07 10:00:11.368242+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
3a11660f-7623-45b2-8423-759bf84bcd5c	0309965849	2025-11-07 04:17:00.294+00	2025-11-07 10:00:00+00	01d24cc5-6946-4fd2-ba23-8d05d993c513	2025-11-07 10:00:11.608229+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
bad00de3-a6d9-4da2-8b23-5c2c47572a3e	0305949593	2025-11-07 04:14:29.691+00	2025-11-07 10:00:00+00	3371afc5-3aaf-4189-b089-89ec9abbdfa8	2025-11-07 10:00:11.804387+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
76f84adb-d6cf-4bf4-9f1b-32fffb8614c4	0292942201	2025-11-07 04:11:23.45+00	2025-11-07 10:00:00+00	97c2a7b8-279e-4654-b6d4-3f746461c17e	2025-11-07 10:00:12.011478+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
5ace825d-0a6e-4067-9a43-8c383aaa2666	0307121449	2025-11-07 04:08:21.238+00	2025-11-07 10:00:00+00	a5ea439f-b8db-448e-869e-49e71c714f4f	2025-11-07 10:00:12.184436+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
f9c6765d-92da-48b5-9dd5-780141208360	0310121913	2025-11-07 04:06:51.492+00	2025-11-07 10:00:00+00	c2fc254a-dfc4-4b5e-a77c-f080afa09ba0	2025-11-07 10:00:12.353048+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
3f6a1e2f-9939-4c5c-8b82-d1e435d978c1	0305627897	2025-11-07 04:05:13.023+00	2025-11-07 10:00:00+00	ad470715-ae6f-4935-bc68-14ff5e9c9530	2025-11-07 10:00:12.514237+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
53b06a7c-3748-4ce2-8552-055984e62152	0297694825	2025-11-07 04:03:10.407+00	2025-11-07 10:00:00+00	8f4914ce-fefc-4bce-aa7d-e5cf060e08e8	2025-11-07 10:00:12.699609+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
d7110ec3-2aa0-4b24-8c00-13d42ebee49b	0310401145	2025-11-07 04:00:55.256+00	2025-11-07 10:00:00+00	94781ee1-4990-4ab6-a709-174116dd9b17	2025-11-07 10:00:12.913226+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
1f759d30-f9fa-45fa-937b-7a98e056d4d2	0307180281	2025-11-07 03:59:36.716+00	2025-11-07 10:00:00+00	22f147b2-470d-4de8-b150-d790099cbc95	2025-11-07 10:00:13.080169+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
570db719-f569-44d1-a274-e134b0845dfb	0293000041	2025-11-07 03:58:25.016+00	2025-11-07 10:00:00+00	be7ec472-e622-420e-b755-9739fb308bbb	2025-11-07 10:00:13.23825+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
fc8f5da3-79bc-402c-b5fa-e229636ff9b2	0297448905	2025-11-07 03:56:04.007+00	2025-11-07 10:00:00+00	00b11e36-e796-49d8-94db-3daa46c7401d	2025-11-07 10:00:13.404732+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
c1f40fca-c933-4bbe-a491-4b764cb296b0	0293100617	2025-11-07 03:54:24.596+00	2025-11-07 10:00:00+00	280f8e6e-0402-4c9a-93a5-ec2fa943ab05	2025-11-07 10:00:13.57981+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
e5839370-8513-4cff-a473-b4acf41e7b52	0291714329	2025-11-07 03:52:50.004+00	2025-11-07 10:00:00+00	884762b7-4424-4980-89f8-5fe62bf66b1b	2025-11-07 10:00:13.762934+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
772298af-fc1f-4086-9e37-02a00d53d7ed	0304571641	2025-11-07 03:51:36.668+00	2025-11-07 10:00:00+00	6b6b6915-6be2-4ad4-9005-8051b37c9a4d	2025-11-07 10:00:13.95798+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
780a0fa0-8bf4-4f21-9f50-7dcfc65e4f4c	0297680185	2025-11-07 03:49:31.277+00	2025-11-07 10:00:00+00	5d263c36-cfad-43a9-9a85-3b9abcc3d84c	2025-11-07 10:00:14.140628+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
788530be-0e9e-483f-9939-c706d5c1e4b2	0305869721	2025-11-07 03:48:02.221+00	2025-11-07 10:00:00+00	ea96263b-f477-450c-a67c-a041436d623a	2025-11-07 10:00:14.334032+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
b8876f50-28da-4a66-83cd-fb32104a7331	0305476025	2025-11-07 03:45:57.727+00	2025-11-07 10:00:00+00	8159341d-617b-4647-915d-6c77c3f46b4f	2025-11-07 10:00:14.514084+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
c090300b-c5c3-4f88-a09e-9ee97376a8f1	0292914633	2025-11-07 07:17:30.695+00	2025-11-07 10:00:00+00	9ea6b65e-a8ea-46b1-a5da-b899990649cb	2025-11-07 10:00:05.579561+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
d2953e2c-5176-4d13-9845-6be26db803ae	0310416377	2025-11-07 07:13:46.782+00	2025-11-07 10:00:00+00	11f4bfbd-82a4-45e0-85c1-320da2efdda2	2025-11-07 10:00:05.759593+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ad784e62-3067-4411-8b63-c1acf77ff610	0305586697	2025-11-07 07:07:57.716+00	2025-11-07 10:00:00+00	f87b7d66-492c-4bc9-90fc-c20474e771e3	2025-11-07 10:00:05.937147+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
289aa5af-ab9e-494b-90a7-075ff293c2bb	0297543305	2025-11-07 07:03:10.005+00	2025-11-07 10:00:00+00	0e1a4a3c-90e9-4c36-9607-60a4ba0e68e9	2025-11-07 10:00:06.117708+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
f0d07b29-a5af-4862-8285-2a16558156c3	0297377865	2025-11-07 06:58:43.729+00	2025-11-07 10:00:00+00	86075da7-55d5-4b25-807a-c80727d554d9	2025-11-07 10:00:06.32106+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ca6ad356-888b-4e85-b06f-c5626035f0ac	0297364553	2025-11-07 06:54:56.288+00	2025-11-07 10:00:00+00	ec4e0084-1083-4ca1-8ee7-f7c4517b2a50	2025-11-07 10:00:06.508777+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
88fd7a25-1c9a-490c-b9ca-e3e3ba8efe73	0309182473	2025-11-07 06:54:46.521+00	2025-11-07 10:00:00+00	68ff64c0-4694-4e89-9e4a-3078d33fca71	2025-11-07 10:00:06.697133+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
94529677-7012-4b34-a726-808a2a48d37e	0294940121	2025-11-07 06:54:36.06+00	2025-11-07 10:00:00+00	00a46fee-5c6c-4328-8b33-5870c48f8592	2025-11-07 10:00:06.892742+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
492fdbc4-17aa-4d0f-a5cd-aaf723e4e959	0296807385	2025-11-07 06:54:27.731+00	2025-11-07 10:00:00+00	9aec5555-4950-4787-9c60-c98dec4d623c	2025-11-07 10:00:07.090697+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
849cfa4b-32e0-4633-a124-164b4a950f46	0291973721	2025-11-07 06:54:21.375+00	2025-11-07 10:00:00+00	afa56aae-62bf-4d25-a6c9-cf1cec9ac620	2025-11-07 10:00:07.278043+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
fcf30fc9-833a-4090-b3b2-71451ae187b2	0292293337	2025-11-07 06:53:38.425+00	2025-11-07 10:00:00+00	34d9f89c-9dd7-432a-8443-80a6ff253d98	2025-11-07 10:00:07.484803+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
03d4cf71-52a0-4e54-a7e4-705f1c3b8d80	0298351385	2025-11-07 06:52:20.791+00	2025-11-07 10:00:00+00	808f29ab-b1b7-487d-bfe4-3d2182752fd2	2025-11-07 10:00:07.664458+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
a1902427-45e9-4f55-9eb1-d75c5c23ada5	0306401673	2025-11-07 06:45:23.819+00	2025-11-07 10:00:00+00	3d22b21e-310e-4414-8a90-f00bc9cc9c21	2025-11-07 10:00:07.839536+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
60420a9f-88e4-4c59-996b-2d0710f8401f	0310240825	2025-11-07 06:43:31.092+00	2025-11-07 10:00:00+00	f6d26e37-278f-49b5-bd46-0041e0cf9772	2025-11-07 10:00:08.009089+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
340bb3e2-defc-4973-8a92-bcde408bbd92	0305875737	2025-11-07 06:42:32.13+00	2025-11-07 10:00:00+00	0bab02cb-2b13-449d-becc-cb4bc0a5fc37	2025-11-07 10:00:08.238909+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
aa764385-1e89-4ff8-b462-131173936012	0293081065	2025-11-07 06:40:59.632+00	2025-11-07 10:00:00+00	413d21ad-60f9-453c-8635-9f7e1b82e2a7	2025-11-07 10:00:08.427346+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
b502e054-f112-40d9-901e-c05202f63f78	0308507801	2025-11-07 06:39:32.537+00	2025-11-07 10:00:00+00	b5d9058a-a819-46ca-8ad1-9eae5ecb9a4c	2025-11-07 10:00:08.642585+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
d90de9b3-0af2-4e61-8f7d-a3f1b672fda4	0299159369	2025-11-07 06:38:34.387+00	2025-11-07 10:00:00+00	66acea4b-00b3-4700-af83-0c23f17bfcd6	2025-11-07 10:00:08.815647+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
acd1eb9d-2e9f-4804-b559-1daa9e2c62e7	0306944297	2025-11-07 06:36:41.43+00	2025-11-07 10:00:00+00	be2dcbdf-e368-4df3-8024-02a12ca4555d	2025-11-07 10:00:08.99043+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
94d9e5ae-9b08-4ff6-b010-89d2adb8a4b6	0307414297	2025-11-07 06:35:38.866+00	2025-11-07 10:00:00+00	26f393ae-d09a-45ed-bd0e-f9df5092f81f	2025-11-07 10:00:09.183256+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
0be29462-a557-455e-a5cb-457b2ed2fe41	0308352153	2025-11-07 06:34:01.055+00	2025-11-07 10:00:00+00	cfab89f7-37de-4792-900d-fe2bcadeef57	2025-11-07 10:00:09.356574+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
da7f0d13-fef8-49cd-af96-5567de51f8bf	0296896249	2025-11-07 06:31:43.115+00	2025-11-07 10:00:00+00	73789f6a-3ed3-44b6-99a7-8569b2ace27a	2025-11-07 10:00:09.557587+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
2712efa7-0f62-4f67-ac7d-65da10ddf820	0309864537	2025-11-07 06:30:43.648+00	2025-11-07 10:00:00+00	63b52fd7-457a-4c5c-8939-d3578e3517e9	2025-11-07 10:00:09.755976+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
dcab38ea-9e31-4c6e-be16-f86f345f1b07	0298966905	2025-11-07 06:28:53.75+00	2025-11-07 10:00:00+00	54f5dc2a-2eb3-4b7f-bf49-c54a21f2b0f0	2025-11-07 10:00:09.983104+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
e4b9d7fe-b9d1-406f-90c0-02299b83e262	0294884089	2025-11-07 06:28:44.981+00	2025-11-07 10:00:00+00	a049e776-fa2c-44be-82b4-0281fc04835a	2025-11-07 10:00:10.240074+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
cff1cedd-0b85-48d9-b6dd-a98e6a014670	0293506217	2025-11-07 06:28:35.001+00	2025-11-07 10:00:00+00	ca75fa4e-cc4f-4df8-89be-84100b3acdd0	2025-11-07 10:00:10.398524+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
08059c76-97a6-4c4d-8246-0d32d4a7b74d	0292048985	2025-11-07 05:35:59.396+00	2025-11-07 10:00:00+00	83cf148f-f296-4610-aa53-c674e73d7bbe	2025-11-07 10:00:10.80789+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
342dc5f3-3d56-4c61-bdfa-a496cebf8566	0309289673	2025-11-07 04:41:27.875+00	2025-11-07 10:00:00+00	7e880189-5860-450b-8d3b-481b7c55e487	2025-11-07 10:00:11.043414+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
0fdc578f-9830-4b63-8441-0a5495e2ee68	0294859689	2025-11-07 04:34:12.866+00	2025-11-07 10:00:00+00	5bcda862-784e-4570-824e-658f5212e7b6	2025-11-07 10:00:11.252142+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ef7accd8-6ae4-467e-9401-a21d4c6d8797	0294998313	2025-11-07 04:17:54.486+00	2025-11-07 10:00:00+00	7b23b0e7-04c3-4537-abb1-9ed3de49ff13	2025-11-07 10:00:11.434665+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
5df3b28b-b44d-4f35-a4f4-3fdcd9683ef5	0308821929	2025-11-07 04:15:50.724+00	2025-11-07 10:00:00+00	29f9f55f-996f-416c-af0c-e4a6473aca7c	2025-11-07 10:00:11.678655+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
c8a2d9b1-be4e-4b6f-9d3d-b19444969d34	0297567977	2025-11-07 04:14:13.378+00	2025-11-07 10:00:00+00	a1799dd7-77fd-41ff-b29b-87d07ef02078	2025-11-07 10:00:11.865279+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
3c1036dd-2517-495d-b6e4-1d393b2df792	0306921865	2025-11-07 04:11:18.399+00	2025-11-07 10:00:00+00	552a2104-239f-45ec-87ae-5f65f2426104	2025-11-07 10:00:12.07143+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ea720202-f810-4dbf-b8cf-febb077dfaae	0298412537	2025-11-07 04:07:48.951+00	2025-11-07 10:00:00+00	339d6b80-9316-4585-9cdc-9fad246a792b	2025-11-07 10:00:12.246609+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
b7732859-479f-4317-9d53-ad5c16700a84	0297650569	2025-11-07 04:06:16.093+00	2025-11-07 10:00:00+00	57d49fb6-c7e6-4540-8889-331ef5bf82f2	2025-11-07 10:00:12.412416+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
71219116-3779-435a-a39e-8309d4a7bfe8	0117089033	2025-11-07 04:04:16.695+00	2025-11-07 10:00:00+00	d35798de-15db-4ed3-9794-03ea4bd777ec	2025-11-07 10:00:12.570406+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
0fe5e86a-3a6f-45e7-9453-aab4902e030d	0305760169	2025-11-07 04:01:51.506+00	2025-11-07 10:00:00+00	cf31ae71-9894-4a24-aa4e-cbf07314e39a	2025-11-07 10:00:12.798062+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
45305441-097b-4d90-8a21-5d60444bb9bc	0297698745	2025-11-07 04:00:37.266+00	2025-11-07 10:00:00+00	91d5fdc8-d167-4c27-bfbb-ba040b9409b0	2025-11-07 10:00:12.980327+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
bbedc6e9-cadd-41ca-82d8-078ef41cb3fd	0306088873	2025-11-07 03:59:22.037+00	2025-11-07 10:00:00+00	0a320e96-1419-4ab0-839e-831d2dbb8ae7	2025-11-07 10:00:13.129026+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ab732d2c-e701-4051-aaa5-015e00206340	0297391097	2025-11-07 03:57:39.907+00	2025-11-07 10:00:00+00	9084679a-59ba-4628-ad97-2bdf194de9e6	2025-11-07 10:00:13.292787+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
fa11856f-b63c-427f-bc58-4d2689a4e3bf	0306337113	2025-11-07 03:55:51.374+00	2025-11-07 10:00:00+00	a3367f81-a4c3-46be-bba3-8e4f84db55f8	2025-11-07 10:00:13.457937+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
225391e8-cd5e-40ad-9e49-e7c49f3f010c	0296861817	2025-11-07 03:53:30.929+00	2025-11-07 10:00:00+00	7c734d4e-91fe-42bf-ad65-aa99daa38c57	2025-11-07 10:00:13.652854+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ed42032b-08e7-4940-8755-c3bcd2cc4049	0295045993	2025-11-07 03:52:23.53+00	2025-11-07 10:00:00+00	a0f54015-65f1-485c-9362-67ab5896a7ba	2025-11-07 10:00:13.814781+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
9b62b2df-f7e5-4144-9a93-7f8788829965	0116763193	2025-11-07 03:50:45.2+00	2025-11-07 10:00:00+00	a728571d-2265-4ee2-afcc-8668f653d0eb	2025-11-07 10:00:14.007208+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
2bd9d86c-b218-4c09-b8f0-144f54712f69	0309481689	2025-11-07 03:48:53.361+00	2025-11-07 10:00:00+00	8cc9beba-951d-41ee-8e3f-ef559ba590fc	2025-11-07 10:00:14.193418+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
207363dd-5773-4b6f-b1ca-01b199ac4df9	0298120377	2025-11-07 03:47:11.818+00	2025-11-07 10:00:00+00	cf5f4b78-14bf-464d-8155-7823da1877aa	2025-11-07 10:00:14.399131+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7601b04f-362b-431b-af97-9c34afe24819	0292224105	2025-11-07 03:45:14.74+00	2025-11-07 10:00:00+00	4d1a9561-1ed3-4fe3-8ee4-4888b755ef8d	2025-11-07 10:00:14.574917+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
855434da-768a-4fa5-98f4-3b95d03cea36	0308579001	2025-11-07 03:44:46.601+00	2025-11-07 10:00:00+00	ee3a282e-3d59-4659-814b-b0a4a0218853	2025-11-07 10:00:14.636733+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
d7ea4f24-c3e5-44d2-9fa2-ab807425b64d	0292432825	2025-11-07 03:43:27.874+00	2025-11-07 10:00:00+00	a28d5e7e-24e8-4df8-8178-3b8860ab5819	2025-11-07 10:00:14.81977+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
34babbf2-39bc-4f89-8f47-fdf4e4a050c1	0304416569	2025-11-07 03:40:34.236+00	2025-11-07 10:00:00+00	37ad6da9-82d1-47ae-a141-43a2e3f01c5a	2025-11-07 10:00:15.015923+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
5b9b6815-f615-4cdb-bfe4-a24203e37f0d	0293444025	2025-11-07 03:40:23.809+00	2025-11-07 10:00:00+00	121f0c20-eb74-4d70-acf7-edbe7633b801	2025-11-07 10:00:20.713295+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
58342098-521c-4c21-99a0-fcfd4c4ebddc	0293477065	2025-11-07 03:40:14.87+00	2025-11-07 10:00:00+00	55826628-fd83-41a7-9720-4ecfda23e065	2025-11-07 10:00:21.010615+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
5ef8d41d-2854-48dc-9c67-4467fb516f97	0293520825	2025-11-07 03:40:06.392+00	2025-11-07 10:00:00+00	fe841e60-8fa3-4faa-b9c4-09d51c3aa9b2	2025-11-07 10:00:21.625695+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
8f72c5f8-8265-4661-a5eb-3e0bbb737f2b	0307100601	2025-11-07 03:39:16.601+00	2025-11-07 10:00:00+00	68b026d3-04a0-44e3-9a74-a3c7b365da51	2025-11-07 10:00:21.901771+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
fc1d9add-db2c-4acd-a5bc-5dd13b2a2389	0291749353	2025-11-07 03:38:04.965+00	2025-11-07 10:00:00+00	7bc393c4-ef96-4c1c-9433-a688940adf50	2025-11-07 10:00:22.071406+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
e781c52e-57d1-430d-9ea7-a62895d035e6	0292908521	2025-11-07 03:36:33.179+00	2025-11-07 10:00:00+00	cf96ecb2-ace9-4a9b-a945-3874b64c897b	2025-11-07 10:00:22.260456+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
d840ac16-b7bf-4160-89fc-18d8941151e5	0293044713	2025-11-07 03:35:01.203+00	2025-11-07 10:00:00+00	cce12e69-49d2-4913-a851-e82405088c8c	2025-11-07 10:00:22.427953+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
06d778d4-6f74-4403-9f5c-aafaa3a5c39f	0306068281	2025-11-07 03:33:43.058+00	2025-11-07 10:00:00+00	23edafef-f741-44b6-8c75-068f1c80221a	2025-11-07 10:00:22.599201+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
6fa26e8c-be1b-4014-91e8-010bb05c6f38	0309458201	2025-11-07 03:32:11.772+00	2025-11-07 10:00:00+00	7c4ce9cf-5d2c-4ab9-b533-6b4b94aded91	2025-11-07 10:00:22.759532+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
b0443b15-d807-41b1-b78e-0af81f6046c9	0293027753	2025-11-07 03:30:14.572+00	2025-11-07 10:00:00+00	43be9ea1-9cd4-4b1b-8386-702dcfd23259	2025-11-07 10:00:22.938687+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
e252a5e8-8c82-4968-bf07-3f28d8f4e448	0306172985	2025-11-07 03:28:32.452+00	2025-11-07 10:00:00+00	a5f42626-b48f-4f71-a68c-cc3bdcb9e392	2025-11-07 10:00:23.097613+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
8bd8b2a3-d372-4d56-a286-c4e5d4375959	0305619497	2025-11-07 03:28:11.679+00	2025-11-07 10:00:00+00	52e78e50-1fec-4c5f-b094-cd25e62ee692	2025-11-07 10:00:23.271074+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
540fe2c0-e4cd-43d4-96af-a3d3db17ba1e	0308559609	2025-11-07 03:27:58.833+00	2025-11-07 10:00:00+00	cbd0c648-736d-491e-bfa6-4acae85e3e96	2025-11-07 10:00:23.455292+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
750e55e5-0bda-4793-8346-19ddc9eec42c	0306026953	2025-11-07 03:25:32.975+00	2025-11-07 10:00:00+00	676c9b7f-3754-4e77-834c-3fae3646a05a	2025-11-07 10:00:23.630618+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ab15a4ac-41ff-4e94-8ca7-eb0f8ecf3f25	0307007017	2025-11-07 03:22:30.828+00	2025-11-07 10:00:00+00	8d680c58-091f-4076-9bf1-09bbc074330f	2025-11-07 10:00:23.80233+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
8554f4bb-86e6-4599-88f1-aa15d1a9a879	0299039577	2025-11-07 03:44:19.264+00	2025-11-07 10:00:00+00	8a25bf88-19e3-4d96-ad88-e9ff47b9f08c	2025-11-07 10:00:14.709819+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
19070d11-b340-48ec-8811-3394ebf0b05e	0124062361	2025-11-07 03:42:18.36+00	2025-11-07 10:00:00+00	244765c1-8642-48bb-9d48-f7f6bc134c99	2025-11-07 10:00:14.868158+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
0a2e3dd7-6f11-4a1d-8d0d-051dc8a72302	0304798761	2025-11-07 03:40:29.533+00	2025-11-07 10:00:00+00	7dd0dc4d-b9c3-412c-bc7d-3a7993898d7f	2025-11-07 10:00:15.101255+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
c9b63d73-b73e-4e6a-8253-77ff31bcbdcb	0292613097	2025-11-07 03:40:19.418+00	2025-11-07 10:00:00+00	448d518d-aca5-4929-810a-f84a2df1d907	2025-11-07 10:00:20.823386+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
1a04bb40-1cc7-4300-af4c-ca6bc26844c0	0293955785	2025-11-07 03:40:12.056+00	2025-11-07 10:00:00+00	b19f94c0-80b0-4f61-b1dd-1a65c3acfc6e	2025-11-07 10:00:21.360973+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
b004d65e-9d8c-4144-bc0f-4733445e59bf	0304652201	2025-11-07 03:40:03.503+00	2025-11-07 10:00:00+00	b3698b32-7d93-4c16-8153-d5d01a9530e9	2025-11-07 10:00:21.733359+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
25f60bc5-b5f3-4ab0-bf1a-b2b039c313a8	0305533561	2025-11-07 03:39:06.582+00	2025-11-07 10:00:00+00	5a793fe2-1495-47ae-8a37-da7cff4f08eb	2025-11-07 10:00:21.957445+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
a015d815-dda0-452c-891d-fc0479fab05b	0305746521	2025-11-07 03:37:24.123+00	2025-11-07 10:00:00+00	3bd2ef6b-60b6-4df1-bb0d-54b1fdbedd6e	2025-11-07 10:00:22.122472+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
083b6fec-6a9a-48d7-91a2-6ee76fc1949f	0297266233	2025-11-07 03:35:42.625+00	2025-11-07 10:00:00+00	846c11ff-efe8-40d8-93b9-86fead0056b2	2025-11-07 10:00:22.317206+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
5aca546b-2299-4c84-97f3-b75fb855e6fd	0297614649	2025-11-07 03:34:45.469+00	2025-11-07 10:00:00+00	28553eca-0e0b-4b7a-838f-54b6985d2faa	2025-11-07 10:00:22.480865+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
6f0ca246-1b7f-4021-a91c-52c4c4a2698e	0297083833	2025-11-07 03:33:17.451+00	2025-11-07 10:00:00+00	23ec0cd1-9994-42ac-9e73-86fc3ac14bf1	2025-11-07 10:00:22.655644+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ea6870c0-297e-4b2e-99d1-0fa0677c97d9	0310093193	2025-11-07 03:32:05.052+00	2025-11-07 10:00:00+00	a2e7007d-7b1b-467d-8603-340a915ba76f	2025-11-07 10:00:22.812833+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
59f5c9d0-68e6-4fba-81e5-a9ae0c8e4420	0295216089	2025-11-07 03:29:43.811+00	2025-11-07 10:00:00+00	c3ee521a-255c-4801-81d2-201c435dd701	2025-11-07 10:00:22.995434+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ba5411e5-aeaf-46a0-8f9c-0ba3de970022	0308402953	2025-11-07 03:28:20.278+00	2025-11-07 10:00:00+00	8a0c6399-1df0-4b68-b5ba-c003ea56935a	2025-11-07 10:00:23.151383+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7dc33687-63b8-4281-bd6d-db757b4548d2	0296846777	2025-11-07 03:28:04.549+00	2025-11-07 10:00:00+00	eacc539d-00c3-474d-bf26-83234d1a3116	2025-11-07 10:00:23.337911+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7a07a86b-01fe-496b-8fbe-4020235b8891	0292815465	2025-11-07 03:27:51.187+00	2025-11-07 10:00:00+00	413dd9c0-6d90-4ad9-824b-72a0e47739bb	2025-11-07 10:00:23.504303+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ebc6ac8a-b858-46ab-8e9c-c33e8ef352e3	0295359849	2025-11-07 03:25:09.664+00	2025-11-07 10:00:00+00	90e5513b-b0e5-4189-a79e-a101c4eda03f	2025-11-07 10:00:23.697363+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
ef6a222e-a50a-459c-ad79-591369e6b5e0	0305632073	2025-11-07 03:43:36.108+00	2025-11-07 10:00:00+00	a855d8d0-d653-42ed-a98a-cf253726ebf2	2025-11-07 10:00:14.762677+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
0e2acaa9-6601-42a8-9c0c-88f25ba21c9b	0122532889	2025-11-07 03:41:29.98+00	2025-11-07 10:00:00+00	be97debf-464f-4820-8a52-fe9976e1806d	2025-11-07 10:00:14.940829+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7b574de8-cb6f-4ed7-b442-419be4fe8a13	0291844777	2025-11-07 03:40:24.389+00	2025-11-07 10:00:00+00	f427d9a7-b4d5-48c7-a1b8-0fd6a1e8065d	2025-11-07 10:00:20.542421+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
06a35162-a699-4fb6-8278-b854d6632c70	0292613097	2025-11-07 03:40:18.52+00	2025-11-07 10:00:00+00	94afbdde-8f5d-4e02-8435-9dda9aa8474a	2025-11-07 10:00:20.912067+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
34de8c8e-30f3-4798-8a65-94e9ed2874eb	0293441241	2025-11-07 03:40:08.187+00	2025-11-07 10:00:00+00	eff62f19-a8b0-4cb7-8579-50ee65e3c583	2025-11-07 10:00:21.508326+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
b2f15ae9-a6fe-418c-981a-52331596e516	0304711385	2025-11-07 03:40:00.509+00	2025-11-07 10:00:00+00	7f6738f7-96b6-45ad-bcfb-447555705dc1	2025-11-07 10:00:21.828222+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
9f01c550-9600-4965-9e61-3a0fc7424cdb	0304731241	2025-11-07 03:38:06.788+00	2025-11-07 10:00:00+00	937e96cc-0c14-4eb6-b4c3-f816607e45d7	2025-11-07 10:00:22.012722+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
75a8624f-aa51-458e-a747-94c342f9f53f	0304567881	2025-11-07 03:36:44.297+00	2025-11-07 10:00:00+00	38c7de07-1619-486b-b322-3cf04ca5081e	2025-11-07 10:00:22.184342+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7e503e29-a244-4be0-8dce-c41777a6a715	0291773817	2025-11-07 03:35:40.322+00	2025-11-07 10:00:00+00	6ab6129c-e05d-4aef-adbd-044bae260f9d	2025-11-07 10:00:22.376795+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
dd13389a-6216-4688-b7e5-ef088e4a333d	0305764601	2025-11-07 03:34:26.897+00	2025-11-07 10:00:00+00	3dbc20b2-3986-4d04-a405-d8bf6f33f3a3	2025-11-07 10:00:22.536528+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
db21551a-7143-4bda-af55-52b2a6dda465	0291935785	2025-11-07 03:32:47.156+00	2025-11-07 10:00:00+00	bfdc8994-874b-4688-873f-c17c8fefd0cb	2025-11-07 10:00:22.706282+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
365ca9aa-bdc7-4c3a-81bb-e6d321f12086	0294715225	2025-11-07 03:30:54.387+00	2025-11-07 10:00:00+00	1423c1e5-0c51-4f6b-a481-4240e06cef92	2025-11-07 10:00:22.87049+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
a81e1269-07bb-4b8f-92cc-cf715a92f301	0305740041	2025-11-07 03:29:12.313+00	2025-11-07 10:00:00+00	31f16cb0-c63a-4945-a7fc-65545ab53fb9	2025-11-07 10:00:23.045919+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
7f34c863-9e62-49bb-a59a-c9da7d9f35f7	0306191849	2025-11-07 03:28:17.834+00	2025-11-07 10:00:00+00	5dd3f4b4-4ff6-422b-b825-f58e9d58b821	2025-11-07 10:00:23.213038+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
de5a7539-301f-4c83-990a-a9876d610a25	0298837641	2025-11-07 03:28:02.364+00	2025-11-07 10:00:00+00	c4424a63-91c2-467e-8cf3-c86bfb684b7a	2025-11-07 10:00:23.395732+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
0179af94-4338-4c37-939e-1c1400c083d0	0305675017	2025-11-07 03:27:11.989+00	2025-11-07 10:00:00+00	d02a7a9b-a372-44c1-a5e6-1431295df102	2025-11-07 10:00:23.575169+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
616d6691-b782-4cd0-b6eb-2b2c1fe9d030	0306046265	2025-11-07 03:23:47.118+00	2025-11-07 10:00:00+00	e0d87c70-518b-4632-b07d-f455ddd09829	2025-11-07 10:00:23.748443+00	Auto-timeout inserted at 6:00 PM for student who forgot to tap out
\.


--
-- TOC entry 4470 (class 0 OID 104260)
-- Dependencies: 403
-- Data for Name: email_verifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."email_verifications" ("email", "code", "expires_at", "created_at") FROM stdin;
johnrgrafe@gmail.com	90215	2025-11-02 18:02:17.721+00	2025-11-02 17:52:17.733+00
\.


--
-- TOC entry 4477 (class 0 OID 107178)
-- Dependencies: 422
-- Data for Name: grade_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."grade_sections" ("id", "grade_level", "section_name", "created_at") FROM stdin;
1	1	Magalang	2025-11-08 11:57:59.529319+00
2	1	Malinis	2025-11-08 11:57:59.529319+00
3	1	Masipag	2025-11-08 11:57:59.529319+00
4	1	Masunurin	2025-11-08 11:57:59.529319+00
5	2	Gumamela	2025-11-08 11:57:59.529319+00
6	2	Orchid	2025-11-08 11:57:59.529319+00
7	2	Rosal	2025-11-08 11:57:59.529319+00
8	2	Sampaguita	2025-11-08 11:57:59.529319+00
9	2	Santan	2025-11-08 11:57:59.529319+00
10	2	Sunflower	2025-11-08 11:57:59.529319+00
11	3	Earth	2025-11-08 11:57:59.529319+00
12	3	Jupiter	2025-11-08 11:57:59.529319+00
13	3	Mars	2025-11-08 11:57:59.529319+00
14	3	Mercury	2025-11-08 11:57:59.529319+00
15	3	Venus	2025-11-08 11:57:59.529319+00
16	4	Mt Apo	2025-11-08 11:57:59.529319+00
17	4	Mt Arayat	2025-11-08 11:57:59.529319+00
18	4	Mt Banahaw	2025-11-08 11:57:59.529319+00
19	4	Mt Kanlaon	2025-11-08 11:57:59.529319+00
20	4	Mt Makiling	2025-11-08 11:57:59.529319+00
21	5	Bonifacio	2025-11-08 11:57:59.529319+00
22	5	Del Pilar	2025-11-08 11:57:59.529319+00
23	5	Luna	2025-11-08 11:57:59.529319+00
24	5	Mabini	2025-11-08 11:57:59.529319+00
25	5	Silang	2025-11-08 11:57:59.529319+00
26	6	Aguinaldo	2025-11-08 11:57:59.529319+00
27	6	Laurel	2025-11-08 11:57:59.529319+00
28	6	Magsaysay	2025-11-08 11:57:59.529319+00
29	6	Quezon	2025-11-08 11:57:59.529319+00
30	6	Roxas	2025-11-08 11:57:59.529319+00
\.


--
-- TOC entry 4443 (class 0 OID 17536)
-- Dependencies: 373
-- Data for Name: login_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."login_logs" ("id", "user_id", "success", "login_time", "ip_address") FROM stdin;
542	63	t	2025-10-23 07:36:00.679433	localhost
543	63	t	2025-10-23 07:51:50.253708	localhost
544	63	t	2025-10-23 10:37:09.949929	localhost
545	63	t	2025-10-23 10:48:59.558176	localhost
546	63	t	2025-10-23 10:50:44.438918	localhost
547	63	t	2025-10-23 10:51:53.270273	localhost
548	63	t	2025-10-23 11:01:32.660755	localhost
549	63	t	2025-10-23 11:07:23.440577	localhost
550	63	t	2025-10-23 11:19:52.052762	localhost
551	63	t	2025-10-23 11:22:32.108611	localhost
552	63	t	2025-10-23 11:23:22.737187	localhost
553	63	t	2025-10-23 12:34:13.620434	localhost
554	63	t	2025-10-23 12:54:22.541992	localhost
555	63	t	2025-10-23 12:56:47.341986	localhost
556	63	t	2025-10-23 13:45:22.930978	localhost
557	63	t	2025-10-23 13:54:48.959843	localhost
558	63	t	2025-10-23 14:03:07.918752	localhost
559	63	t	2025-10-23 14:05:41.403823	localhost
560	63	t	2025-10-23 14:08:53.164536	localhost
561	63	t	2025-10-23 14:11:35.419503	localhost
562	63	t	2025-10-23 14:18:41.365767	localhost
563	63	t	2025-10-23 14:37:23.334697	localhost
564	63	t	2025-10-23 14:38:06.318978	localhost
565	63	t	2025-10-23 14:47:02.444435	localhost
566	63	f	2025-10-23 14:51:42.631271	localhost
567	63	f	2025-10-23 14:51:59.286943	localhost
568	63	f	2025-10-23 14:52:08.646747	localhost
569	63	t	2025-10-23 15:17:23.748003	localhost
570	63	t	2025-10-23 17:28:39.387417	localhost
571	63	t	2025-10-23 17:32:57.79455	localhost
572	63	t	2025-10-23 17:57:14.66792	localhost
573	63	t	2025-10-23 18:03:41.790862	localhost
574	63	t	2025-10-23 18:24:39.325129	localhost
575	63	t	2025-10-23 22:52:02.847395	localhost
576	63	t	2025-10-23 23:13:13.185928	localhost
577	63	t	2025-10-23 23:17:27.800722	localhost
578	63	t	2025-10-24 01:04:32.147763	localhost
579	63	t	2025-10-24 01:22:00.304014	localhost
580	63	t	2025-10-24 01:28:12.424572	localhost
581	63	t	2025-10-24 02:47:47.577734	localhost
582	63	t	2025-10-24 02:50:54.814889	localhost
583	63	t	2025-10-24 03:06:00.238543	localhost
584	63	t	2025-10-24 03:11:45.074855	localhost
585	63	t	2025-10-24 03:15:38.922122	localhost
586	63	t	2025-10-24 03:23:36.158405	localhost
587	63	t	2025-10-24 03:26:49.945742	localhost
588	63	t	2025-10-24 03:28:02.554753	localhost
589	63	t	2025-10-24 03:31:30.60828	localhost
590	63	t	2025-10-24 03:44:35.682437	localhost
591	63	t	2025-10-24 05:04:24.030705	localhost
592	63	t	2025-10-24 05:33:17.07533	localhost
593	63	t	2025-10-24 06:11:32.771004	localhost
594	63	t	2025-10-27 09:35:56.214518	localhost
595	63	t	2025-10-27 13:09:31.191283	localhost
596	63	t	2025-10-27 13:29:47.042911	localhost
597	63	t	2025-10-28 08:12:56.331925	localhost
598	63	t	2025-10-30 12:44:19.513958	localhost
599	63	t	2025-10-30 13:11:43.679539	localhost
600	63	t	2025-10-30 14:40:00.90232	localhost
601	63	t	2025-10-30 15:20:26.873378	localhost
602	63	t	2025-10-30 15:22:30.85707	localhost
603	63	t	2025-10-30 15:27:58.71601	localhost
604	63	t	2025-10-30 15:36:27.944262	localhost
605	63	t	2025-10-30 15:55:26.073348	localhost
606	63	t	2025-10-30 15:59:12.337293	localhost
607	63	t	2025-10-30 16:03:38.409311	localhost
608	63	t	2025-10-30 16:10:53.697527	localhost
609	63	t	2025-10-30 16:23:32.248514	localhost
610	63	t	2025-10-30 16:35:48.522425	localhost
611	63	t	2025-10-30 16:46:13.009579	localhost
612	63	t	2025-10-30 16:50:48.73019	localhost
613	63	t	2025-10-30 16:54:03.570684	localhost
614	63	t	2025-10-30 16:58:43.433465	localhost
615	63	t	2025-10-30 17:05:13.845455	localhost
616	63	t	2025-10-30 17:08:19.103282	localhost
617	63	t	2025-10-30 17:30:19.923957	localhost
618	63	t	2025-10-30 17:32:26.854223	localhost
619	63	t	2025-10-30 17:36:02.112851	localhost
620	63	t	2025-10-30 18:23:42.101834	localhost
621	63	t	2025-10-30 18:26:04.690811	localhost
622	63	t	2025-10-30 18:31:08.344127	localhost
623	63	f	2025-10-30 18:35:09.376075	localhost
624	63	t	2025-10-30 18:35:14.378986	localhost
625	63	t	2025-10-30 18:42:22.873616	localhost
626	63	t	2025-10-30 18:44:42.315218	localhost
627	63	t	2025-10-30 18:49:02.643893	localhost
628	63	t	2025-10-30 18:51:58.912886	localhost
629	63	t	2025-10-30 18:54:04.796027	localhost
630	63	t	2025-10-30 19:01:24.829011	localhost
631	63	t	2025-10-30 19:02:12.178446	localhost
632	63	t	2025-10-30 19:04:27.001274	localhost
633	63	t	2025-10-30 19:08:11.818534	localhost
634	63	t	2025-10-30 19:15:34.150985	localhost
635	63	t	2025-10-30 19:18:29.912217	localhost
636	63	t	2025-10-30 19:19:30.711002	localhost
637	63	t	2025-10-30 19:22:06.879975	localhost
638	63	t	2025-10-30 19:24:03.65617	localhost
639	63	t	2025-10-30 19:25:28.715781	localhost
640	63	t	2025-10-30 19:27:55.682201	localhost
641	63	t	2025-10-30 19:29:08.392364	localhost
642	63	t	2025-10-31 10:01:02.082802	localhost
643	63	t	2025-10-31 10:28:55.384167	localhost
644	63	t	2025-10-31 10:32:51.720441	localhost
645	63	t	2025-10-31 10:49:32.054249	localhost
646	63	t	2025-10-31 10:51:53.596958	localhost
647	63	t	2025-10-31 11:51:37.722252	localhost
648	63	t	2025-10-31 11:54:48.980931	localhost
649	63	t	2025-10-31 11:57:49.94722	localhost
650	63	t	2025-10-31 12:23:10.546089	localhost
651	63	t	2025-10-31 13:05:09.662129	localhost
652	63	t	2025-10-31 13:07:29.05958	localhost
653	63	t	2025-10-31 13:08:06.652974	localhost
654	63	t	2025-10-31 13:09:28.328989	localhost
655	63	t	2025-10-31 14:04:56.438556	localhost
656	63	t	2025-10-31 14:13:47.678464	localhost
657	63	t	2025-10-31 16:00:59.253027	localhost
658	63	t	2025-10-31 16:28:50.332508	localhost
659	63	t	2025-10-31 16:40:17.613825	localhost
660	63	t	2025-10-31 17:08:10.94839	localhost
661	63	t	2025-11-01 13:32:54.666547	localhost
662	63	t	2025-11-01 13:40:05.566681	localhost
663	63	t	2025-11-01 14:56:10.193425	localhost
664	63	t	2025-11-01 15:34:05.981864	localhost
665	63	t	2025-11-01 15:35:40.776302	localhost
666	63	t	2025-11-01 15:39:32.134257	localhost
667	63	t	2025-11-01 15:53:12.773172	localhost
668	63	t	2025-11-01 16:17:01.208382	localhost
669	63	t	2025-11-01 17:55:44.827619	localhost
670	63	f	2025-11-01 18:25:51.364161	localhost
671	63	t	2025-11-01 18:26:00.735822	localhost
672	63	t	2025-11-01 18:30:58.439256	localhost
673	63	t	2025-11-01 18:31:28.910356	localhost
674	63	t	2025-11-01 18:34:17.255075	localhost
675	63	t	2025-11-01 18:36:20.143165	localhost
676	63	t	2025-11-01 18:38:55.610907	localhost
677	63	t	2025-11-01 18:41:11.729457	localhost
678	63	t	2025-11-01 18:45:04.881889	localhost
679	63	t	2025-11-02 09:41:24.99421	localhost
680	63	t	2025-11-02 09:43:06.055269	localhost
681	63	t	2025-11-02 09:44:00.199506	localhost
682	63	t	2025-11-02 09:45:19.625364	localhost
683	63	t	2025-11-02 09:46:28.523449	localhost
684	63	t	2025-11-02 09:47:43.907036	localhost
685	63	t	2025-11-02 10:26:44.746179	localhost
686	63	t	2025-11-02 10:27:29.411454	localhost
687	63	t	2025-11-02 10:28:56.992906	localhost
688	63	f	2025-11-02 10:36:06.778721	localhost
689	63	t	2025-11-02 10:36:11.548905	localhost
690	63	t	2025-11-02 10:45:01.030607	localhost
691	63	t	2025-11-02 11:11:04.71914	localhost
692	63	t	2025-11-02 11:12:47.497528	localhost
693	63	t	2025-11-02 11:18:28.707711	localhost
694	63	f	2025-11-02 11:20:56.317925	localhost
695	63	t	2025-11-02 11:21:00.530105	localhost
696	63	t	2025-11-02 12:08:51.823128	localhost
697	63	t	2025-11-02 12:15:24.706967	localhost
698	63	t	2025-11-02 12:17:39.718454	localhost
699	63	t	2025-11-02 12:19:00.080084	localhost
700	63	f	2025-11-02 12:26:05.118214	localhost
701	63	f	2025-11-02 12:26:12.374584	localhost
702	63	t	2025-11-02 12:26:18.145645	localhost
703	63	t	2025-11-02 12:31:40.55194	localhost
704	63	t	2025-11-02 12:36:51.478525	localhost
705	63	t	2025-11-02 12:37:54.344626	localhost
706	63	t	2025-11-02 12:40:25.48044	localhost
707	63	t	2025-11-02 12:46:06.679485	localhost
708	63	t	2025-11-02 12:55:08.701992	localhost
709	63	t	2025-11-02 13:01:55.394421	localhost
710	63	t	2025-11-02 13:05:36.018304	localhost
711	63	t	2025-11-02 13:12:22.66631	localhost
712	63	t	2025-11-02 13:23:56.798901	localhost
713	63	t	2025-11-02 13:40:53.587712	localhost
714	63	t	2025-11-02 15:14:00.973853	localhost
715	63	t	2025-11-02 17:56:46.688735	localhost
716	63	t	2025-11-03 02:51:51.887039	localhost
717	63	t	2025-11-03 03:05:20.15155	localhost
718	63	t	2025-11-03 03:31:58.169011	localhost
719	63	t	2025-11-03 06:50:12.915305	localhost
720	63	t	2025-11-03 16:05:15.2753	localhost
721	63	t	2025-11-04 03:09:48.60767	localhost
722	63	t	2025-11-04 03:25:44.340441	localhost
723	63	t	2025-11-04 03:35:31.321765	localhost
724	63	t	2025-11-04 03:53:20.354897	localhost
725	63	t	2025-11-04 03:59:36.926395	localhost
726	63	t	2025-11-04 04:01:43.454367	localhost
727	63	t	2025-11-04 04:07:15.914288	localhost
728	63	t	2025-11-04 04:08:36.771919	localhost
729	63	t	2025-11-04 04:16:44.400134	localhost
730	63	t	2025-11-04 04:18:45.943944	localhost
731	63	t	2025-11-04 04:22:48.366513	localhost
732	63	t	2025-11-04 04:25:14.413313	localhost
733	63	t	2025-11-04 04:29:27.991324	localhost
734	63	t	2025-11-04 04:31:17.385268	localhost
735	63	t	2025-11-04 04:45:38.920502	localhost
736	63	t	2025-11-04 04:46:44.830488	localhost
737	63	t	2025-11-04 08:34:57.180181	localhost
738	63	t	2025-11-04 15:07:48.863322	localhost
739	63	t	2025-11-04 16:30:15.007476	localhost
740	63	t	2025-11-04 16:43:34.124957	localhost
741	63	t	2025-11-04 16:44:20.393267	localhost
742	63	t	2025-11-04 16:52:42.201486	localhost
743	63	t	2025-11-04 16:58:47.066864	localhost
744	63	t	2025-11-04 17:03:04.12101	localhost
745	63	t	2025-11-04 17:05:18.336673	localhost
746	63	t	2025-11-04 17:07:00.907747	localhost
747	63	t	2025-11-04 17:07:32.136638	localhost
748	63	t	2025-11-04 17:09:52.356513	localhost
749	63	t	2025-11-04 17:10:54.146229	localhost
750	63	t	2025-11-04 17:17:01.49657	localhost
751	63	t	2025-11-04 17:18:55.33096	localhost
752	63	t	2025-11-04 17:24:19.435974	localhost
753	63	t	2025-11-04 17:25:18.854363	localhost
754	63	t	2025-11-04 17:29:09.864003	localhost
755	63	t	2025-11-04 17:31:13.787614	localhost
756	63	t	2025-11-04 17:34:43.575618	localhost
757	63	t	2025-11-04 17:36:01.211967	localhost
758	63	t	2025-11-04 17:39:22.785383	localhost
759	63	t	2025-11-04 20:15:24.27672	localhost
760	63	t	2025-11-04 20:23:14.909866	localhost
761	63	t	2025-11-04 20:34:12.084003	localhost
762	63	t	2025-11-04 20:38:03.41562	localhost
763	63	t	2025-11-04 20:52:50.739793	localhost
764	63	t	2025-11-04 20:59:19.405084	localhost
765	63	t	2025-11-04 21:00:06.10889	localhost
766	63	t	2025-11-05 02:18:17.913899	localhost
767	63	t	2025-11-05 02:24:42.317748	localhost
768	63	t	2025-11-05 02:25:20.317475	localhost
769	63	f	2025-11-05 02:26:13.18376	localhost
770	63	t	2025-11-05 02:26:17.271718	localhost
771	63	t	2025-11-05 02:27:19.657505	localhost
772	63	t	2025-11-05 02:28:55.994393	localhost
773	63	t	2025-11-05 02:36:42.372944	localhost
774	63	t	2025-11-05 02:41:25.304257	localhost
775	63	t	2025-11-05 02:42:38.215918	localhost
776	63	t	2025-11-05 02:46:20.02265	localhost
777	63	t	2025-11-05 04:02:52.032655	localhost
778	63	t	2025-11-05 04:06:11.510192	localhost
779	63	t	2025-11-05 04:14:32.298912	localhost
780	63	t	2025-11-05 04:17:22.055316	localhost
781	63	t	2025-11-05 04:19:48.463594	localhost
782	63	t	2025-11-05 04:23:31.977723	localhost
783	63	t	2025-11-05 04:24:53.828054	localhost
784	63	t	2025-11-05 04:27:49.874934	localhost
785	63	t	2025-11-05 04:29:53.101913	localhost
786	63	t	2025-11-05 04:31:06.051434	localhost
787	63	t	2025-11-05 04:32:46.087931	localhost
788	63	t	2025-11-05 06:10:21.086802	localhost
789	63	t	2025-11-05 06:11:52.900591	localhost
790	63	t	2025-11-05 06:37:05.503863	localhost
791	63	t	2025-11-05 06:44:18.991295	localhost
792	63	t	2025-11-05 06:45:34.161277	localhost
793	63	t	2025-11-05 06:46:58.062076	localhost
794	63	t	2025-11-05 06:48:25.781788	localhost
795	63	t	2025-11-05 06:51:11.209253	localhost
796	63	t	2025-11-05 06:51:46.978436	localhost
797	63	t	2025-11-05 06:52:38.582	localhost
798	63	t	2025-11-05 07:18:58.151218	localhost
799	63	t	2025-11-06 02:54:56.520371	localhost
800	63	t	2025-11-06 03:43:23.737613	localhost
801	63	t	2025-11-06 08:32:00.740318	localhost
802	63	t	2025-11-06 08:38:13.056816	localhost
803	63	t	2025-11-06 08:53:24.932944	localhost
804	63	t	2025-11-06 08:57:23.531262	localhost
805	63	t	2025-11-06 09:15:39.323424	localhost
806	63	t	2025-11-06 09:34:57.702686	localhost
807	63	t	2025-11-06 09:37:42.077557	localhost
808	63	t	2025-11-06 09:39:17.730045	localhost
809	63	t	2025-11-06 09:51:08.482605	localhost
810	63	t	2025-11-06 09:53:43.18226	localhost
811	63	t	2025-11-06 09:59:40.105577	localhost
812	63	t	2025-11-06 11:02:02.338124	localhost
813	63	t	2025-11-06 11:11:55.917256	localhost
814	63	t	2025-11-06 11:16:12.298402	localhost
815	63	t	2025-11-06 11:18:18.549668	localhost
816	63	t	2025-11-06 11:19:00.109618	localhost
817	63	t	2025-11-06 11:20:33.400968	localhost
818	63	t	2025-11-06 11:24:23.307865	localhost
819	63	t	2025-11-06 11:26:24.10426	localhost
820	63	t	2025-11-06 11:30:33.186039	localhost
821	63	t	2025-11-06 11:37:58.234692	localhost
822	63	t	2025-11-06 15:28:02.302589	localhost
823	63	t	2025-11-06 15:45:13.233928	localhost
824	63	t	2025-11-06 16:10:11.766286	localhost
825	63	t	2025-11-06 16:15:09.843532	localhost
826	63	t	2025-11-06 16:16:14.865349	localhost
827	63	t	2025-11-06 16:17:05.611211	localhost
828	63	t	2025-11-06 16:18:27.701549	localhost
829	63	t	2025-11-07 03:10:38.713707	localhost
830	63	t	2025-11-07 03:15:38.257444	localhost
831	63	t	2025-11-07 03:20:58.136015	localhost
832	63	t	2025-11-07 03:23:53.204113	localhost
833	63	t	2025-11-08 09:13:24.503724	localhost
834	63	t	2025-11-08 09:33:26.836946	localhost
835	63	t	2025-11-08 09:55:03.929933	localhost
836	63	t	2025-11-08 10:02:26.618972	localhost
837	63	t	2025-11-08 10:17:19.581216	localhost
838	63	t	2025-11-08 16:18:53.279211	localhost
839	63	t	2025-11-08 16:30:12.810225	localhost
840	63	t	2025-11-08 17:09:31.458678	localhost
841	63	t	2025-11-08 17:13:39.109977	localhost
842	63	t	2025-11-08 17:15:16.724857	localhost
843	63	t	2025-11-08 17:23:56.531325	localhost
844	63	t	2025-11-08 17:27:20.519497	localhost
845	63	t	2025-11-08 17:33:31.702737	localhost
846	63	t	2025-11-08 17:35:49.25935	localhost
847	63	t	2025-11-08 17:37:14.654088	localhost
848	63	t	2025-11-08 17:40:43.445563	localhost
849	63	t	2025-11-08 17:58:59.444072	localhost
850	63	t	2025-11-09 04:06:55.317134	localhost
851	63	t	2025-11-09 04:08:22.086459	localhost
852	63	t	2025-11-10 08:30:34.783233	localhost
\.


--
-- TOC entry 4462 (class 0 OID 90302)
-- Dependencies: 394
-- Data for Name: rfid_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."rfid_logs" ("id", "rfid", "tap_count", "tap_type", "timestamp", "created_at") FROM stdin;
14859150-92c0-4b8d-a18a-85c1083698fe	1100994932	1	time_in	2025-11-03 07:32:47.273+00	2025-11-03 07:32:47.470745+00
cbae141d-0c51-4784-92c5-ef63619b7a52	1100994932	2	time_out	2025-11-03 07:34:30.773+00	2025-11-03 07:34:30.950894+00
7c3dface-6cc3-4c3c-9fe2-4b893d432c82	1100994932	1	time_in	2025-11-04 03:14:19.724+00	2025-11-04 03:14:20.684867+00
cc2c6fd5-4ce8-4abd-a8b8-b126c54233f2	0293477065	1	time_in	2025-11-04 03:17:02.225+00	2025-11-04 03:17:03.194828+00
35610ec2-c1cd-4bda-a481-46c4b9d43fd1	0304711385	1	time_in	2025-11-04 03:17:12.981+00	2025-11-04 03:17:13.913395+00
453107e0-ddca-43cd-a578-9a0d180816c7	0304416569	1	time_in	2025-11-04 03:17:19.155+00	2025-11-04 03:17:20.075759+00
eb347c2c-0522-4dca-929d-1481de412c99	0293955785	1	time_in	2025-11-04 03:17:23.486+00	2025-11-04 03:17:24.410183+00
05cc68aa-7422-45eb-9d4c-b34bd6d528b2	0293520825	1	time_in	2025-11-04 03:17:26.324+00	2025-11-04 03:17:27.260101+00
2fd6f861-8d30-4dbc-8e17-3d3fc14be634	0293441241	1	time_in	2025-11-04 03:17:29.227+00	2025-11-04 03:17:30.158245+00
f694448f-b14c-4634-b0a8-388e55aebfed	0304652201	1	time_in	2025-11-04 03:17:35.967+00	2025-11-04 03:17:36.890379+00
10aefb6e-8a4d-41f8-a6a4-7be07b41ed95	0293444025	1	time_in	2025-11-04 03:17:39.011+00	2025-11-04 03:17:39.935902+00
566318f0-817c-46ec-97f6-e5de8b4d0547	0304798761	1	time_in	2025-11-04 03:17:40.877+00	2025-11-04 03:17:41.79603+00
6a6f44d2-7b45-4690-a3c2-81f87d2e74ee	0306191849	1	time_in	2025-11-04 03:22:49.578+00	2025-11-04 03:22:50.531262+00
d65f4055-5315-4227-b1b2-fd2daaf253e9	0308127897	1	time_in	2025-11-04 03:22:53.394+00	2025-11-04 03:22:54.31776+00
5829639a-90ad-4283-84ea-071f9b93a9c7	0305619497	1	time_in	2025-11-04 03:22:57.406+00	2025-11-04 03:22:58.33252+00
c07488ae-fb02-4e17-b672-a04006bec66f	0308372745	1	time_in	2025-11-04 03:23:02.98+00	2025-11-04 03:23:03.901631+00
bd16b5c5-ae7c-43fe-a312-72b07977ff1a	0308181369	1	time_in	2025-11-04 03:23:08.096+00	2025-11-04 03:23:09.015495+00
f4b9afc2-a0f3-4b34-b31d-261600407f30	0298837641	1	time_in	2025-11-04 03:23:19.289+00	2025-11-04 03:23:20.215074+00
4019cd0e-6de9-4b9b-86a0-c53817ae3d85	0308402953	1	time_in	2025-11-04 03:23:25.301+00	2025-11-04 03:23:26.228372+00
9115b913-ce66-48aa-b288-85b7982e0ea8	0308559609	1	time_in	2025-11-04 03:23:36.159+00	2025-11-04 03:23:37.094062+00
6da34ec6-7203-49a4-926c-d56fef849310	1100994932	2	time_out	2025-11-04 03:26:47.972+00	2025-11-04 03:26:48.901086+00
e08764eb-02f9-42fd-bcc5-5d0ba3778cfd	0293477065	2	time_out	2025-11-04 03:39:37.175+00	2025-11-04 03:39:37.951013+00
10b8dace-ddf7-40ea-8e36-dd1a98dbaa2f	0304711385	2	time_out	2025-11-04 03:39:41.361+00	2025-11-04 03:39:42.135421+00
7f7722d7-04d8-4631-97f6-db93ca62fc41	0304416569	2	time_out	2025-11-04 03:39:44.778+00	2025-11-04 03:39:45.552394+00
b966939d-e2b7-4495-a4c1-a0f969d96f9d	0293520825	2	time_out	2025-11-04 03:39:48.852+00	2025-11-04 03:39:49.624914+00
63c5f2e4-05b7-438a-8838-7f8edd789753	0304652201	2	time_out	2025-11-04 03:39:52.633+00	2025-11-04 03:39:53.397561+00
721e6431-7249-44a0-95eb-c5f38cb3c9f2	0293955785	2	time_out	2025-11-04 03:39:54.865+00	2025-11-04 03:39:55.652713+00
f085cb76-e533-4f86-a9ad-da8619ea83d1	0293441241	2	time_out	2025-11-04 03:39:59.504+00	2025-11-04 03:40:00.272945+00
cee7879e-324a-48f9-86c1-ef63745135ab	0293444025	2	time_out	2025-11-04 03:40:02.103+00	2025-11-04 03:40:02.870112+00
f552e1b7-7f65-40c5-ac45-d000fc342716	0292613097	1	time_in	2025-11-04 03:41:00.985+00	2025-11-04 03:41:01.751896+00
acf0567c-919b-40e0-89d3-02760a0bc6d6	0292613097	2	time_out	2025-11-04 03:41:04.023+00	2025-11-04 03:41:04.77884+00
cd29fbf3-ce95-4354-9484-302143eb6813	0304798761	2	time_out	2025-11-04 03:41:12.266+00	2025-11-04 03:41:13.015391+00
62890efc-1f28-40f8-80e5-e5e5c829cf9b	0296807385	1	time_in	2025-11-04 03:41:16.549+00	2025-11-04 03:41:17.308694+00
3e7c4ef8-df7a-475e-88f1-8e33413f15da	0291973721	1	time_in	2025-11-04 03:41:30.585+00	2025-11-04 03:41:31.349825+00
4beecbae-5171-43d1-830a-c65fecfe3fc6	0306191849	2	time_out	2025-11-04 03:50:05.561+00	2025-11-04 03:50:06.221225+00
3df217d3-e0dd-4932-9f98-4b2373ba4473	0308402953	2	time_out	2025-11-04 03:50:29.863+00	2025-11-04 03:50:30.527414+00
58e7bde2-100c-45e9-a38c-f24b4aaa3190	0305619497	2	time_out	2025-11-04 03:50:37.567+00	2025-11-04 03:50:38.223093+00
fa713f86-7713-466c-a5fe-a5c93b126c72	0308559609	2	time_out	2025-11-04 03:50:46.731+00	2025-11-04 03:50:47.371713+00
3b7edff1-13d0-44ea-a94c-bc157567b8fe	0308181369	2	time_out	2025-11-04 03:51:02.423+00	2025-11-04 03:51:03.087338+00
3332a200-7a64-4a34-a99c-e2774f8e93f5	0309182473	1	time_in	2025-11-04 03:52:13.273+00	2025-11-04 03:52:13.912858+00
4876f827-b6f1-4db4-a0fa-eded71b1dd36	0308432841	1	time_in	2025-11-04 03:52:18.544+00	2025-11-04 03:52:19.181628+00
1db04005-574c-465b-ac27-111a6d0f67d8	0308127897	2	time_out	2025-11-04 03:52:40.736+00	2025-11-04 03:52:41.359899+00
301cd2bd-f205-4914-8695-590cfa4f8124	0308039577	1	time_in	2025-11-04 03:53:30.666+00	2025-11-04 03:53:31.30116+00
15dfef12-379a-443e-97b3-a8fc7a2c0b79	0298967657	1	time_in	2025-11-04 03:54:52.01+00	2025-11-04 03:54:52.616186+00
403dbf02-d0e5-4276-bc21-965a20f79a97	0292301481	1	time_in	2025-11-04 04:10:48.898+00	2025-11-04 04:10:49.370911+00
0cf27bb3-fba8-4912-bf95-52306057a2ad	0308372745	2	time_out	2025-11-04 10:00:00+00	2025-11-04 10:24:34.678642+00
180e9a83-88c8-46a5-b650-f9990cfa8709	0298837641	2	time_out	2025-11-04 10:00:00+00	2025-11-04 10:24:34.800918+00
ef72a04b-86c6-417e-b19f-6b7bd12b6b14	0296807385	2	time_out	2025-11-04 10:00:00+00	2025-11-04 10:24:34.899389+00
5a39ba52-8215-428b-9cdc-67499baca47a	0291973721	2	time_out	2025-11-04 10:00:00+00	2025-11-04 10:24:35.002883+00
e875a7f4-eb08-4fc5-97c9-b9f8ea138cbf	0309182473	2	time_out	2025-11-04 10:00:00+00	2025-11-04 10:24:35.091671+00
c3cd197d-9c2d-415a-9271-861b027e25c7	0308432841	2	time_out	2025-11-04 10:00:00+00	2025-11-04 10:24:35.185369+00
905cfc14-1d5b-45f1-9d5b-d14da2237957	0308039577	2	time_out	2025-11-04 10:00:00+00	2025-11-04 10:24:35.283502+00
8834fd80-ff66-445c-9d06-9b8f0af34a9e	0298967657	2	time_out	2025-11-04 10:00:00+00	2025-11-04 10:24:35.381036+00
0dbc7872-94ac-43f3-ac69-165719a54e69	0292301481	2	time_out	2025-11-04 10:00:00+00	2025-11-04 10:24:35.482235+00
a7d2056a-e520-4bfe-821a-220e58128052	1100994932	1	time_in	2025-11-05 07:03:16.754+00	2025-11-05 07:03:16.771415+00
8bf00ee7-73f4-4fcb-90c7-3226b04b59e7	1100994932	2	time_out	2025-11-05 07:04:34.023+00	2025-11-05 07:04:34.025127+00
a03bf6b8-6108-4580-9062-6559350ba0d0	0304628105	1	time_in	2025-11-05 07:16:31.31+00	2025-11-05 07:16:31.436412+00
35ed5180-d8e2-455a-ba7d-0f755f6cd663	0304628105	2	time_out	2025-11-05 10:00:00+00	2025-11-05 10:00:03.510295+00
7fe33a4f-7dc7-470e-840f-1d1f2793c263	0308559609	1	time_in	2025-11-06 03:07:21.948+00	2025-11-06 03:07:22.116747+00
122b6d9f-0d50-42c4-a8af-edf9ee487e24	0308127897	1	time_in	2025-11-06 03:07:25.226+00	2025-11-06 03:07:25.258859+00
9022a953-ca19-4173-b4d2-10d68788e60e	0308181369	1	time_in	2025-11-06 03:07:27.983+00	2025-11-06 03:07:28.012479+00
fa67f9da-a975-4a5c-96d3-65aabcbcae0e	0308372745	1	time_in	2025-11-06 03:07:30.938+00	2025-11-06 03:07:30.971647+00
0e09e97f-a68e-4d03-b1f2-cb58ae8e7249	0306191849	1	time_in	2025-11-06 03:07:35.682+00	2025-11-06 03:07:35.832831+00
1480ca34-6ded-41c7-86e2-d1ff0290b2b6	0308402953	1	time_in	2025-11-06 03:07:38.361+00	2025-11-06 03:07:38.409402+00
a111fba6-efc6-41ef-8173-2dcef2306a02	0298837641	1	time_in	2025-11-06 03:07:48.69+00	2025-11-06 03:07:48.714717+00
290c664b-3500-41e7-84d1-66a4ac3516cc	0305619497	1	time_in	2025-11-06 03:08:00.729+00	2025-11-06 03:08:00.760504+00
96d89783-c9d0-4471-a115-5a003c6eb7df	0293477065	1	time_in	2025-11-06 03:08:47.012+00	2025-11-06 03:08:47.072306+00
c526cf97-9e0a-47fa-b1fd-b8fec2ce7fc5	0304711385	1	time_in	2025-11-06 03:08:50.011+00	2025-11-06 03:08:50.039868+00
f52a5d53-1849-4744-a6c9-1c169d16d3c7	0293520825	1	time_in	2025-11-06 03:08:52.897+00	2025-11-06 03:08:52.924873+00
9ec6a198-daa0-4532-bb6f-97a918363757	0293955785	1	time_in	2025-11-06 03:08:55.101+00	2025-11-06 03:08:55.131007+00
8904c9e2-9f2b-4951-b63e-a3c15686382e	0293441241	1	time_in	2025-11-06 03:08:57.184+00	2025-11-06 03:08:57.210849+00
ae9ff4be-ed38-4e12-98c8-43a8328ce9f6	0304798761	1	time_in	2025-11-06 03:08:59.802+00	2025-11-06 03:08:59.850001+00
15f69e4b-d3c2-4ea7-bb33-8e600b64b802	0292613097	1	time_in	2025-11-06 03:09:02.153+00	2025-11-06 03:09:02.18837+00
fe87255f-b007-4cde-ac80-4b9b8d9de5bc	0293444025	1	time_in	2025-11-06 03:09:04.905+00	2025-11-06 03:09:04.934461+00
b7f9579f-8555-4d12-981d-0cd9a8f8a266	0304416569	1	time_in	2025-11-06 03:09:06.535+00	2025-11-06 03:09:06.583958+00
56be35a6-5086-48a6-9002-604a9b416c05	0308081913	1	time_in	2025-11-06 03:11:23.846+00	2025-11-06 03:11:23.881606+00
53a4912a-faac-4550-862e-94048f26c9e5	0308147193	1	time_in	2025-11-06 03:11:26.794+00	2025-11-06 03:11:26.818505+00
64571de4-6e51-476f-8e81-795c79a895cc	0306098393	1	time_in	2025-11-06 03:11:28.417+00	2025-11-06 03:11:28.436902+00
010ab923-3a2f-40bb-a5ff-244ff367b63f	0291623817	1	time_in	2025-11-06 03:11:29.897+00	2025-11-06 03:11:29.920015+00
9539c852-8593-455b-8995-6f9808aa8d52	0291757897	1	time_in	2025-11-06 03:11:37.429+00	2025-11-06 03:11:37.454919+00
6924816a-5c59-4c5d-bf23-a43cf83672c0	0292301481	1	time_in	2025-11-06 03:21:23.259+00	2025-11-06 03:21:23.268853+00
85d7c203-4a16-4710-b656-f610efe24658	0293477065	2	time_out	2025-11-06 03:37:35.497+00	2025-11-06 03:37:35.567456+00
052c0a67-4cad-4969-a33b-ef1d566eb277	0304711385	2	time_out	2025-11-06 03:37:45.816+00	2025-11-06 03:37:45.869916+00
8b697936-2f08-43be-883f-61bc49a93308	0293520825	2	time_out	2025-11-06 03:37:48.738+00	2025-11-06 03:37:48.788156+00
f7de06a0-5802-477c-95f1-a26c9fd8a04a	0293955785	2	time_out	2025-11-06 03:37:51.466+00	2025-11-06 03:37:51.517964+00
ff6723e4-0f81-4ae9-842d-84747f2edece	0293441241	2	time_out	2025-11-06 03:37:53.933+00	2025-11-06 03:37:53.975785+00
9e5fd570-8510-4328-90e6-560b1c33d3f8	0292613097	2	time_out	2025-11-06 03:37:55.9+00	2025-11-06 03:37:55.943588+00
54812726-855d-437d-bc4a-bcee2b99802f	0304798761	2	time_out	2025-11-06 03:37:57.798+00	2025-11-06 03:37:57.868828+00
8e22fcb2-2951-470b-80a6-d0b3d1b81705	0293444025	2	time_out	2025-11-06 03:38:01.169+00	2025-11-06 03:38:01.232734+00
ffd05bf4-8ea6-4496-98f7-eacdce494965	0304416569	2	time_out	2025-11-06 03:38:04.459+00	2025-11-06 03:38:04.506125+00
c59b878b-2073-48f4-8ef0-9b1bbdd49d13	0308181369	2	time_out	2025-11-06 03:42:53.919+00	2025-11-06 03:42:53.98619+00
2f76f684-9cc8-44fe-8d10-3c248b244fbb	0308372745	2	time_out	2025-11-06 03:42:55.561+00	2025-11-06 03:42:55.629911+00
e8ee7aea-8bbe-4485-83ee-5590e70da394	0308127897	2	time_out	2025-11-06 03:42:57.602+00	2025-11-06 03:42:57.674164+00
19585925-175c-4b44-9c80-d2c1becd4318	0298837641	2	time_out	2025-11-06 03:43:00.431+00	2025-11-06 03:43:00.499953+00
f07949df-1f6a-4628-93d2-8a0b549d3279	0306191849	2	time_out	2025-11-06 03:43:02.306+00	2025-11-06 03:43:02.364244+00
18ad7e26-4c7a-4052-8ddd-ffcca80c840c	0308402953	2	time_out	2025-11-06 03:43:04.328+00	2025-11-06 03:43:04.393917+00
1d4f6cb9-6d9d-485e-8f2e-ade93eaeaa13	0308559609	2	time_out	2025-11-06 03:43:07.563+00	2025-11-06 03:43:07.633735+00
a0966e21-e854-4131-8e33-aa91592f5382	0305619497	2	time_out	2025-11-06 03:43:09.275+00	2025-11-06 03:43:09.348747+00
ce9a5705-f376-455d-b732-521464526de6	0306098393	2	time_out	2025-11-06 04:23:41.838+00	2025-11-06 04:23:41.783005+00
3915c962-61d9-4c71-b0e9-1299754b9563	0308081913	2	time_out	2025-11-06 04:23:53.652+00	2025-11-06 04:23:53.589534+00
c97a1911-4b98-4fd3-96b6-52fde0c086b8	0308147193	2	time_out	2025-11-06 04:23:55.99+00	2025-11-06 04:23:55.913884+00
d075d63b-b912-4d17-ac7c-a84cae0cd960	0291623817	2	time_out	2025-11-06 04:23:57.682+00	2025-11-06 04:23:57.606576+00
0625d310-71ff-4885-8616-ceaed6fa5e99	0291757897	2	time_out	2025-11-06 04:23:59.695+00	2025-11-06 04:23:59.617728+00
59add6f5-cff0-413f-ab50-1ee36c731003	0292424393	1	time_in	2025-11-06 04:26:04.222+00	2025-11-06 04:26:04.148392+00
414c82db-27d7-4c26-a000-13f2737eaac1	0309182473	1	time_in	2025-11-06 04:26:06.291+00	2025-11-06 04:26:06.213954+00
ea228433-08d1-4677-944b-1e7686869b75	0298967657	1	time_in	2025-11-06 04:26:08.202+00	2025-11-06 04:26:08.122275+00
d5750795-5878-481e-8c88-410378427d3c	0308432841	1	time_in	2025-11-06 04:26:10.17+00	2025-11-06 04:26:10.147186+00
434726fc-537e-4a00-a01b-e6b8bbf80990	0308039577	1	time_in	2025-11-06 04:26:13.355+00	2025-11-06 04:26:13.276908+00
9c96afd2-8528-45af-8b3d-86b714f0508e	0292210489	1	time_in	2025-11-06 04:26:23.027+00	2025-11-06 04:26:22.977035+00
38fe5468-e67a-4c1e-b6ed-72e25422df8b	0298966905	1	time_in	2025-11-06 04:28:01.834+00	2025-11-06 04:28:01.781107+00
99d5eafd-877e-473e-afd3-5b5bc6bb3de5	0294788905	1	time_in	2025-11-06 04:28:16.397+00	2025-11-06 04:28:16.324494+00
cc3156c5-d48e-43ca-bde8-1b2cbb769d0d	1100972749	1	time_in	2025-11-06 04:28:20.394+00	2025-11-06 04:28:20.321478+00
8470b7f8-006e-487e-a138-29b95c37a0cb	0296836713	1	time_in	2025-11-06 04:28:24.283+00	2025-11-06 04:28:24.223778+00
f2df4f1a-c7b1-4527-b648-3c3ff1702573	0295114121	1	time_in	2025-11-06 04:28:26.833+00	2025-11-06 04:28:26.752792+00
de2a3079-6f43-4b38-9567-559d94c5924d	0294884089	1	time_in	2025-11-06 04:28:29.655+00	2025-11-06 04:28:29.571009+00
ad479313-a3a5-4eac-b8ef-ee9c65f7e573	0299103609	1	time_in	2025-11-06 04:30:39.079+00	2025-11-06 04:30:39.003029+00
a31d0c61-a502-4937-b277-6deacadd5c24	0291955241	1	time_in	2025-11-06 04:30:46.572+00	2025-11-06 04:30:46.51422+00
e1aeed6e-1d4d-422e-b8e9-8ef22803b0ce	0297377865	1	time_in	2025-11-06 04:30:51.199+00	2025-11-06 04:30:51.136494+00
477dc05e-27a9-473f-a661-cc658dc1bdf1	0305101593	1	time_in	2025-11-06 04:31:02.306+00	2025-11-06 04:31:02.248093+00
1056fa6e-e206-4685-9734-e6a3a68ab68d	1100979479	1	time_in	2025-11-06 04:31:07.86+00	2025-11-06 04:31:07.781545+00
40e0cbfe-8beb-43c8-8115-93a9a2aa36db	1100979479	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:04.440749+00
a26e61a9-c5ba-48b8-8039-468e85064ce8	0305101593	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:04.611978+00
722c558c-d33b-42ca-b457-e3c3bf7e053e	0297377865	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:04.771524+00
cd19de82-1c3c-4e39-9d02-65338d1a4fc7	0291955241	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:04.893529+00
1e4adf8a-9378-4315-8ad2-6a2720114b97	0299103609	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.024511+00
1be7e29f-33b1-4d48-92ad-60536956b458	0294884089	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.131918+00
317db771-3e81-43f4-8f72-615e8942162e	0295114121	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.209121+00
12e369d9-490f-4a58-b628-67108ea2d777	0296836713	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.277067+00
f05be294-98c5-4990-a3ac-73c603645c2a	1100972749	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.336285+00
c9015fb4-f82a-4661-afa4-acedd12688d0	0294788905	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.40561+00
8798d502-b635-4430-a709-62b3c79b4de6	0298966905	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.469629+00
e286813c-4f0f-41ad-a7d1-9e53464279db	0292210489	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.534776+00
89592848-d70c-49c6-a91c-87dcf8fbe785	0308039577	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.600346+00
27664a99-d491-497a-bf1f-35f2e8a6610a	0308432841	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.675185+00
557604e0-70e4-4ab0-a8c6-e80fda20c914	0298967657	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.77194+00
37971977-c98a-4160-ac44-6503e7fe7572	0309182473	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:05.900264+00
e3042791-eda7-4ad2-8cdd-2d1680b7dd91	0292424393	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:06.019925+00
489e59d4-0909-4dab-be02-2ee6b200f7f4	0292301481	2	time_out	2025-11-06 10:00:00+00	2025-11-06 10:00:06.150932+00
de638a3a-43be-44cd-92e4-d1934b2a6117	0307007017	1	time_in	2025-11-07 03:22:30.828+00	2025-11-07 03:22:30.885268+00
ac915136-2665-4f71-ad4c-32c44ac8ddb0	0306046265	1	time_in	2025-11-07 03:23:47.118+00	2025-11-07 03:23:47.12704+00
15c89c08-d478-4e31-827b-3350649083ea	0295359849	1	time_in	2025-11-07 03:25:09.664+00	2025-11-07 03:25:09.679456+00
ff66bf34-898d-4927-8f18-7dcc99cc0632	0306026953	1	time_in	2025-11-07 03:25:32.975+00	2025-11-07 03:25:32.173571+00
c9d6fa3b-02b2-4722-ba91-5dee0e190db8	0305675017	1	time_in	2025-11-07 03:27:11.989+00	2025-11-07 03:27:11.175485+00
38b08f9a-f6ac-4995-b972-c0a7011abbb9	0292815465	1	time_in	2025-11-07 03:27:51.187+00	2025-11-07 03:27:51.20476+00
bfb6015f-2e36-4e61-974a-c02b2215d7d7	0308559609	1	time_in	2025-11-07 03:27:58.833+00	2025-11-07 03:27:58.875208+00
9b427de2-c62e-40f2-8626-47a008446df6	0298837641	1	time_in	2025-11-07 03:28:02.364+00	2025-11-07 03:28:02.454963+00
28f58ce8-572f-49a8-8558-e035c6e8d841	0296846777	1	time_in	2025-11-07 03:28:04.549+00	2025-11-07 03:28:04.565061+00
cc380483-83fb-4cbf-8dec-bd90382cbaa2	0308127897	1	time_in	2025-11-07 03:28:08.627+00	2025-11-07 03:28:08.689194+00
32e60428-3e24-4856-941e-fe631dcb33e3	0305619497	1	time_in	2025-11-07 03:28:11.679+00	2025-11-07 03:28:11.690913+00
5267a39a-d2e2-4be0-b08a-d0d2fb7b1067	0308181369	1	time_in	2025-11-07 03:28:14.089+00	2025-11-07 03:28:14.110058+00
b69de6ae-59ee-4edc-acba-0012ea8f2fbc	0306191849	1	time_in	2025-11-07 03:28:17.834+00	2025-11-07 03:28:17.849619+00
47481f11-ade0-4d46-be46-419d2ea5c94a	0308402953	1	time_in	2025-11-07 03:28:20.278+00	2025-11-07 03:28:20.302713+00
f35f62a2-aeb0-4469-bf12-b7ce81c31f4c	0306172985	1	time_in	2025-11-07 03:28:32.452+00	2025-11-07 03:28:31.657641+00
be7ceea3-de49-4d38-80ca-4a5cc352e82b	0305740041	1	time_in	2025-11-07 03:29:12.313+00	2025-11-07 03:29:11.501386+00
3c4565fa-c464-453d-a36f-f7ee9ca311b2	0295216089	1	time_in	2025-11-07 03:29:43.811+00	2025-11-07 03:29:43.836311+00
4e4cc52f-5ef0-4a7a-b4cf-a465b81f603e	0293027753	1	time_in	2025-11-07 03:30:14.572+00	2025-11-07 03:30:13.774708+00
6c4fb2d0-1452-4eae-aea7-818ac5bb9d5b	0294715225	1	time_in	2025-11-07 03:30:54.387+00	2025-11-07 03:30:54.510867+00
dcc30cb2-c3b0-4bd1-a34f-c593a36eebaa	0310093193	1	time_in	2025-11-07 03:32:05.052+00	2025-11-07 03:32:04.237588+00
98e0ebbf-b88e-447a-acf8-aae4892b972e	0309458201	1	time_in	2025-11-07 03:32:11.772+00	2025-11-07 03:32:11.796287+00
b7ce593c-06d6-4ea0-baaf-7638bbd93dd1	0291935785	1	time_in	2025-11-07 03:32:47.156+00	2025-11-07 03:32:46.325696+00
2d0506b3-0504-4d79-93b2-a0b3d14ded1f	0297083833	1	time_in	2025-11-07 03:33:17.451+00	2025-11-07 03:33:17.480121+00
44d7883d-0da0-46fc-a685-9717ad6ba24f	0306068281	1	time_in	2025-11-07 03:33:43.058+00	2025-11-07 03:33:42.239025+00
d70bd947-842a-4c68-b364-796f0e447d02	0305764601	1	time_in	2025-11-07 03:34:26.897+00	2025-11-07 03:34:26.07386+00
6b316eca-1822-4784-84e5-24e73f3dea94	0297614649	1	time_in	2025-11-07 03:34:45.469+00	2025-11-07 03:34:45.501666+00
f2ec298a-e5a6-4870-a2c9-0ffaff70557d	0293044713	1	time_in	2025-11-07 03:35:01.203+00	2025-11-07 03:35:00.384222+00
0221fac1-199d-4541-9f12-207565f3db92	0291773817	1	time_in	2025-11-07 03:35:40.322+00	2025-11-07 03:35:39.50204+00
8c9cd7d3-c94b-4dbe-aa46-ee8e0228c986	0297266233	1	time_in	2025-11-07 03:35:42.625+00	2025-11-07 03:35:42.664889+00
e452bdab-0ce6-4367-bd5d-4997a9d3c070	0292908521	1	time_in	2025-11-07 03:36:33.179+00	2025-11-07 03:36:32.358965+00
d7eb61d3-852d-4726-b1e2-fe655b9b1bc6	0304567881	1	time_in	2025-11-07 03:36:44.297+00	2025-11-07 03:36:44.329853+00
df558eaf-19bd-469c-8fb5-009f670581ea	0305746521	1	time_in	2025-11-07 03:37:24.123+00	2025-11-07 03:37:23.297698+00
bebf7e53-1a29-4f96-8384-3debb645b75c	0291749353	1	time_in	2025-11-07 03:38:04.965+00	2025-11-07 03:38:04.148844+00
d832d4cd-f689-4554-96b5-e5ab22357740	0304731241	1	time_in	2025-11-07 03:38:06.788+00	2025-11-07 03:38:06.814002+00
29c6a04f-98c6-40df-8b1f-ebc6dcfe2823	0305533561	1	time_in	2025-11-07 03:39:06.582+00	2025-11-07 03:39:05.752072+00
f74e2369-3f1d-4c3e-bf72-bbf53bf58123	0307100601	1	time_in	2025-11-07 03:39:16.601+00	2025-11-07 03:39:16.615256+00
274aaaa2-7d97-49ca-acfa-a96d4cfd0313	0304711385	1	time_in	2025-11-07 03:40:00.509+00	2025-11-07 03:40:00.559342+00
521701bd-6fa7-41ba-9888-05d1446217d0	0304652201	1	time_in	2025-11-07 03:40:03.503+00	2025-11-07 03:40:03.533428+00
fd099da8-d95a-4656-85b9-3266a88643b8	0293520825	1	time_in	2025-11-07 03:40:06.392+00	2025-11-07 03:40:06.425968+00
7a612cda-0dc8-49af-a0d6-80d50b8452c1	0293441241	1	time_in	2025-11-07 03:40:08.187+00	2025-11-07 03:40:08.224046+00
c5a7cc10-379e-4bcb-9a81-ee858c26cf16	0293955785	1	time_in	2025-11-07 03:40:12.056+00	2025-11-07 03:40:12.085746+00
3ae1567b-4fa6-4f90-b1fd-0680d52cefb5	0293477065	1	time_in	2025-11-07 03:40:14.87+00	2025-11-07 03:40:14.898809+00
80aa0a27-4374-43f2-97e2-7f8319b412ab	0292613097	1	time_in	2025-11-07 03:40:18.52+00	2025-11-07 03:40:18.539967+00
cde73d63-d0ea-4979-8435-85b60a044350	0292613097	1	time_in	2025-11-07 03:40:19.418+00	2025-11-07 03:40:19.43432+00
65cd02b3-47cb-4f39-8fae-9c9f2512a02b	0291844777	1	time_in	2025-11-07 03:40:24.389+00	2025-11-07 03:40:23.557605+00
95a421d5-45a6-4a73-8a3d-57eab0db177a	0293444025	1	time_in	2025-11-07 03:40:23.809+00	2025-11-07 03:40:23.835314+00
5af54acf-1d35-49e7-bbfe-fb5f187218e4	0304798761	1	time_in	2025-11-07 03:40:29.533+00	2025-11-07 03:40:29.556827+00
a85a5f8a-f91c-4a63-aa51-273027aa9cda	0304416569	1	time_in	2025-11-07 03:40:34.236+00	2025-11-07 03:40:34.270159+00
684c6878-3cad-497e-aa96-ea1df4361cf4	0122532889	1	time_in	2025-11-07 03:41:29.98+00	2025-11-07 03:41:29.139753+00
2f2a5ad7-f48b-4212-8f9d-9f5cec1162f8	0124062361	1	time_in	2025-11-07 03:42:18.36+00	2025-11-07 03:42:17.521341+00
a452fd0e-053b-4cb6-9b3b-530b0f823db5	0305632073	1	time_in	2025-11-07 03:43:36.108+00	2025-11-07 03:43:36.135112+00
14d6fed1-6238-41c7-9a10-af2ac3df4a54	0299039577	1	time_in	2025-11-07 03:44:19.264+00	2025-11-07 03:44:18.428118+00
9b88b786-1f8c-4f3c-8ba9-1d053289a3f9	0292224105	1	time_in	2025-11-07 03:45:14.74+00	2025-11-07 03:45:13.90978+00
e81c5c9f-8e4d-4b60-bf61-5fcafd644132	0305476025	1	time_in	2025-11-07 03:45:57.727+00	2025-11-07 03:45:57.786789+00
3fdff6c3-dbd9-4d7c-847d-32f8429917b2	0112899417	1	time_in	2025-11-07 03:46:47.966+00	2025-11-07 03:46:47.256337+00
42eef29b-7e7e-4b13-bb93-a2127cec6ea6	0298120377	1	time_in	2025-11-07 03:47:11.818+00	2025-11-07 03:47:11.869396+00
13425ad7-188d-4c24-bce4-5c2a63384175	0305869721	1	time_in	2025-11-07 03:48:02.221+00	2025-11-07 03:48:01.398139+00
865e504f-a44c-4224-92c8-dcc21d54e68a	0298282009	1	time_in	2025-11-07 03:48:10.769+00	2025-11-07 03:48:10.84566+00
e4723a96-d4dd-45eb-a005-0f8727eebac4	0309481689	1	time_in	2025-11-07 03:48:53.361+00	2025-11-07 03:48:52.543201+00
366002a1-97bd-4585-9581-012bb953a2ee	0297680185	1	time_in	2025-11-07 03:49:31.277+00	2025-11-07 03:49:31.366269+00
f420e961-71c7-4242-ad71-bbe7cdacd405	0292432825	1	time_in	2025-11-07 03:43:27.874+00	2025-11-07 03:43:27.045054+00
a4c88431-4444-466a-a3c2-41a996a49516	0308579001	1	time_in	2025-11-07 03:44:46.601+00	2025-11-07 03:44:46.649784+00
b9b7c0ee-9ace-4be5-977e-868ce7c5bcf6	0117272745	1	time_in	2025-11-07 03:49:59.545+00	2025-11-07 03:49:58.731941+00
db5663cf-a631-4286-b5ef-0f3636bb2588	0116763193	1	time_in	2025-11-07 03:50:45.2+00	2025-11-07 03:50:44.414195+00
e2348d0c-fb74-4ca3-8690-6cc391f7995c	0308127897	2	time_out	2025-11-07 03:50:51.711+00	2025-11-07 03:50:51.771121+00
9720ae8c-4b92-42ee-85b3-68855411c0e3	0308181369	2	time_out	2025-11-07 03:51:02.651+00	2025-11-07 03:51:02.74204+00
59782cff-74bf-4345-bf28-8448cf908b97	0304571641	1	time_in	2025-11-07 03:51:36.668+00	2025-11-07 03:51:35.858738+00
3f8598ab-a17f-4033-9350-2847631d03a4	0297578969	1	time_in	2025-11-07 03:51:39.917+00	2025-11-07 03:51:39.983596+00
783efd2f-db83-47a2-a53e-40445ea80484	0295045993	1	time_in	2025-11-07 03:52:23.53+00	2025-11-07 03:52:22.757226+00
17005b18-fa12-4b65-8bff-8178bb8205a4	0291714329	1	time_in	2025-11-07 03:52:50.004+00	2025-11-07 03:52:50.079192+00
5196c51e-da65-4943-bd63-b2221897bd2d	0296861817	1	time_in	2025-11-07 03:53:29.868+00	2025-11-07 03:53:29.048816+00
933d5bc9-ead4-4aff-a0ef-e92ba21bc2f8	0296861817	1	time_in	2025-11-07 03:53:30.929+00	2025-11-07 03:53:30.168167+00
7dd179ee-f55e-4595-a5bd-21670b16a615	0293100617	1	time_in	2025-11-07 03:54:24.596+00	2025-11-07 03:54:24.66473+00
ae970885-e825-404e-8fa0-7d56e489f95e	0113246345	1	time_in	2025-11-07 03:54:54.858+00	2025-11-07 03:54:54.042584+00
3ec786ba-bb6f-4458-a433-010149a9c505	0306337113	1	time_in	2025-11-07 03:55:51.374+00	2025-11-07 03:55:50.566822+00
e1df3f0d-6fdd-4b6a-912c-5b200ec238bb	0297448905	1	time_in	2025-11-07 03:56:04.007+00	2025-11-07 03:56:04.090072+00
af3012b1-f77f-48e0-ae2b-26190913149c	0306494617	1	time_in	2025-11-07 03:56:41.741+00	2025-11-07 03:56:40.922388+00
5203a907-00c8-404e-8cc5-4ab034374022	0297391097	1	time_in	2025-11-07 03:57:39.907+00	2025-11-07 03:57:40.000013+00
b0034fcf-d23f-437e-a1dd-db432869cd56	0293000041	1	time_in	2025-11-07 03:58:25.016+00	2025-11-07 03:58:24.195748+00
b247782c-aac0-4f57-95a7-436682d05269	0298255273	1	time_in	2025-11-07 03:58:49.205+00	2025-11-07 03:58:49.290535+00
4e69fa5d-9834-462b-8c66-cd53e3588f2d	0306088873	1	time_in	2025-11-07 03:59:22.037+00	2025-11-07 03:59:21.234753+00
1fd14d3c-a199-4226-b5b8-71718e3cf914	0307180281	1	time_in	2025-11-07 03:59:36.716+00	2025-11-07 03:59:36.820478+00
cdeba648-5368-439d-93e8-782ec5d59a60	0306301449	1	time_in	2025-11-07 04:00:06.648+00	2025-11-07 04:00:05.836124+00
285ad7d0-e516-4ea9-8703-11afd2ef852e	0297698745	1	time_in	2025-11-07 04:00:37.266+00	2025-11-07 04:00:37.360543+00
5108b7dc-5a4f-4e2b-a837-12d95161a22c	0310401145	1	time_in	2025-11-07 04:00:55.256+00	2025-11-07 04:00:54.432888+00
305af200-615c-42ce-8967-86b869a2a6a2	0297633897	1	time_in	2025-11-07 04:01:47.156+00	2025-11-07 04:01:47.249149+00
86906535-aefb-4b8c-acc0-3cee6c638faa	0305760169	1	time_in	2025-11-07 04:01:51.506+00	2025-11-07 04:01:50.68104+00
64fe446b-a763-4653-8ccb-4c296f49bb78	0297694825	1	time_in	2025-11-07 04:03:10.407+00	2025-11-07 04:03:10.497798+00
03b85b26-5631-4afe-8c3b-4c04288eca3d	0305570809	1	time_in	2025-11-07 04:03:12.192+00	2025-11-07 04:03:11.367839+00
e3c8a842-cabe-4d01-b09c-3fe6fff46f58	0117089033	1	time_in	2025-11-07 04:04:16.695+00	2025-11-07 04:04:15.884586+00
58026317-0372-4d3a-bb09-26eb767cd269	0305627897	1	time_in	2025-11-07 04:05:13.023+00	2025-11-07 04:05:12.200906+00
1e019ff9-d1a3-499d-bc0d-de3c9eb88eca	0309574841	1	time_in	2025-11-07 04:06:08.51+00	2025-11-07 04:06:07.770076+00
cb23fc4e-e0c0-4ee0-824e-a42dc73da70a	0297650569	1	time_in	2025-11-07 04:06:16.093+00	2025-11-07 04:06:16.20894+00
622f8e42-df63-4740-9fac-02b38a7637df	0310121913	1	time_in	2025-11-07 04:06:51.492+00	2025-11-07 04:06:50.671652+00
f473e331-c76f-44fa-a247-40835d3a3435	0307406985	1	time_in	2025-11-07 04:07:15.303+00	2025-11-07 04:07:15.399115+00
ddf0dbe6-f90a-4a25-bd7a-becea889dedd	0298412537	1	time_in	2025-11-07 04:07:48.951+00	2025-11-07 04:07:48.128944+00
c9f8396b-3cb9-4891-8163-ce7f3f8740d6	0307121449	1	time_in	2025-11-07 04:08:21.238+00	2025-11-07 04:08:21.376517+00
9792c591-1b02-4a14-a290-e299bcf57772	0306022393	1	time_in	2025-11-07 04:08:42.564+00	2025-11-07 04:08:41.747062+00
2c176b13-6d50-4138-acb3-e128f01c410e	0306921865	1	time_in	2025-11-07 04:11:18.399+00	2025-11-07 04:11:18.513363+00
36f1406a-9c64-4052-906f-782f99df77a3	0292942201	1	time_in	2025-11-07 04:11:23.45+00	2025-11-07 04:11:22.65326+00
f7e3a5f7-4047-45c9-b2d7-4079d9db99c8	0306322841	1	time_in	2025-11-07 04:13:23.674+00	2025-11-07 04:13:22.848592+00
e3021371-38f8-4b4e-aace-a3fa1c681c78	0297567977	1	time_in	2025-11-07 04:14:13.378+00	2025-11-07 04:14:13.482642+00
858f0174-f447-44a5-88c4-9bf1890e0f89	0305949593	1	time_in	2025-11-07 04:14:29.691+00	2025-11-07 04:14:28.872807+00
dc740652-48a9-4601-8cd0-3e793261d04e	0308557449	1	time_in	2025-11-07 04:15:36.244+00	2025-11-07 04:15:36.357942+00
d270108d-5678-4f98-a5fc-9fb987c19755	0308821929	1	time_in	2025-11-07 04:15:50.724+00	2025-11-07 04:15:49.903327+00
d858e8d8-6e7f-4532-907a-fb2bf1cfa6e8	0309965849	1	time_in	2025-11-07 04:17:00.294+00	2025-11-07 04:16:59.467053+00
4e1ec47c-1c01-4359-988f-a0703f7436a3	0308477257	1	time_in	2025-11-07 04:17:00.308+00	2025-11-07 04:17:00.443965+00
e9c60c9d-dd10-4eeb-8702-11f4f1465c19	0294998313	1	time_in	2025-11-07 04:17:54.486+00	2025-11-07 04:17:53.658626+00
4d4fd544-9aa4-4ce3-b5a3-a9a094a7a0a4	0299009897	1	time_in	2025-11-07 04:33:02.852+00	2025-11-07 04:33:02.962165+00
aa92685a-6527-42aa-9ca3-a8870ef5c7f4	0307877113	1	time_in	2025-11-07 04:34:05.947+00	2025-11-07 04:34:06.268032+00
6ce49cba-6680-4eb8-9209-513325040642	0294859689	1	time_in	2025-11-07 04:34:12.866+00	2025-11-07 04:34:11.994249+00
c2d450b3-1fea-4a58-87de-4dbd43a0ad00	0294859689	1	time_in	2025-11-07 04:34:14.24+00	2025-11-07 04:34:13.363897+00
cf8e8889-3390-49f7-b57f-9488197555ae	0304953593	1	time_in	2025-11-07 04:35:02.834+00	2025-11-07 04:35:02.951796+00
eb82833f-e69a-415d-bb20-27e0c85a1a75	0309289673	1	time_in	2025-11-07 04:41:27.875+00	2025-11-07 04:41:26.99033+00
f82a030d-6c72-4fbe-b26b-4d19b51d446f	0305960329	1	time_in	2025-11-07 05:35:54.635+00	2025-11-07 05:35:53.621286+00
bbd3b189-138b-4d0d-9e5e-8e640b45acd8	0296852729	1	time_in	2025-11-07 05:35:56.512+00	2025-11-07 05:35:55.496724+00
f49a9712-3487-4b9e-b5c0-e8ad6a033af5	0296634233	1	time_in	2025-11-07 05:35:58.081+00	2025-11-07 05:35:57.062967+00
00178099-34ac-4ff8-a695-fdea94380926	0292048985	1	time_in	2025-11-07 05:35:59.396+00	2025-11-07 05:35:58.378668+00
0d104e17-1d32-4d96-bf60-7b61edcea070	0305960329	2	time_out	2025-11-07 05:46:34.991+00	2025-11-07 05:46:33.948091+00
6f9b8625-3a04-4929-a920-6071f35c775d	0294788905	1	time_in	2025-11-07 06:28:30.158+00	2025-11-07 06:28:29.056933+00
16a69e56-dffc-4605-87e9-5fcbc0def2a8	1100979479	1	time_in	2025-11-07 06:28:34.222+00	2025-11-07 06:28:33.105519+00
eac84cc2-6b14-4b13-951d-9fe63f5d9366	0293506217	1	time_in	2025-11-07 06:28:35.001+00	2025-11-07 06:28:35.875374+00
86c88ed2-845e-4df4-9f59-6732ef292cb4	0309381401	1	time_in	2025-11-07 06:28:37.367+00	2025-11-07 06:28:36.254175+00
24a7755c-2ad7-43e9-92d0-3a01a43cfef2	0305101593	1	time_in	2025-11-07 06:28:40.5+00	2025-11-07 06:28:41.316281+00
f035243a-b20f-4f83-af71-4292483f6dda	0294884089	1	time_in	2025-11-07 06:28:44.981+00	2025-11-07 06:28:45.814573+00
71b68705-2cfb-48ef-8ecc-5f8f01153379	1100972749	1	time_in	2025-11-07 06:28:48.35+00	2025-11-07 06:28:49.165529+00
06346418-252e-480e-a9cd-32892721a5b7	0296836713	1	time_in	2025-11-07 06:28:51.536+00	2025-11-07 06:28:52.35327+00
8ac140ff-eb10-4a63-b63c-7593437fccf4	0298966905	1	time_in	2025-11-07 06:28:53.75+00	2025-11-07 06:28:54.580092+00
a3690d8e-e76e-41bf-8280-8405be153c1f	0295114121	1	time_in	2025-11-07 06:28:55.706+00	2025-11-07 06:28:56.519267+00
f9cc9c73-a67b-4689-8f86-0339fbd688ee	0308566713	1	time_in	2025-11-07 06:30:17.701+00	2025-11-07 06:30:16.586896+00
506157cf-7474-42f0-b9b7-e89e47a991b5	0309864537	1	time_in	2025-11-07 06:30:43.648+00	2025-11-07 06:30:44.48605+00
af66422e-61ee-4f8c-8830-a82f4bba8fe7	0305499433	1	time_in	2025-11-07 06:31:10.004+00	2025-11-07 06:31:08.882313+00
e3391a39-43e2-429d-88f2-c1397a8b2e53	0305499433	1	time_in	2025-11-07 06:31:10.815+00	2025-11-07 06:31:09.728984+00
28d30940-b013-49eb-bf95-57f67a91de7c	0296896249	1	time_in	2025-11-07 06:31:43.115+00	2025-11-07 06:31:43.945525+00
133b20f3-8136-428f-bf03-432fd0dc4e5c	0293000713	1	time_in	2025-11-07 06:32:37.345+00	2025-11-07 06:32:36.213405+00
6fe09998-5a18-45cc-ad23-ae3704bf08cd	0309725945	1	time_in	2025-11-07 06:32:41.892+00	2025-11-07 06:32:42.716504+00
cff8158f-b806-4a7b-882c-91680a409552	0308352153	1	time_in	2025-11-07 06:34:01.055+00	2025-11-07 06:33:59.942002+00
04f775ae-af65-4ecb-8f7b-3fc9a0f39b2b	0309377641	1	time_in	2025-11-07 06:34:10.034+00	2025-11-07 06:34:10.875374+00
d888a6ba-9050-429e-98c5-ce9a6cc80cf2	0305588489	1	time_in	2025-11-07 06:35:08.838+00	2025-11-07 06:35:07.716646+00
e732f2aa-c66d-43dd-a15d-8da4e5bf38d1	0307414297	1	time_in	2025-11-07 06:35:38.866+00	2025-11-07 06:35:39.701329+00
d8d3c1a3-2606-4b32-95cb-02fb2d752720	0308018329	1	time_in	2025-11-07 06:36:01.752+00	2025-11-07 06:36:00.631395+00
396b3c97-a3a7-4174-8625-3ca7407ac30b	0308301369	1	time_in	2025-11-07 06:36:39.704+00	2025-11-07 06:36:38.597102+00
27216488-ac88-4748-a0b9-71019ed05d09	0306944297	1	time_in	2025-11-07 06:36:41.43+00	2025-11-07 06:36:42.294715+00
b31a77e8-4308-4fc9-ade7-53a7032f41fd	0308578201	1	time_in	2025-11-07 06:37:23.559+00	2025-11-07 06:37:22.475257+00
6e05e72a-7dbd-4a8d-8951-98e090dc223e	0298922889	1	time_in	2025-11-07 06:37:33.795+00	2025-11-07 06:37:34.643575+00
17b0fc18-002b-41ed-9fa3-595711a70b6e	0299159369	1	time_in	2025-11-07 06:38:34.387+00	2025-11-07 06:38:35.265414+00
f3c43865-d6e4-4a98-a3e9-197365e50200	0308506473	1	time_in	2025-11-07 06:38:39.808+00	2025-11-07 06:38:38.719222+00
420e5c68-f19b-41e2-b8c0-4edc7eeac3ee	0291865289	1	time_in	2025-11-07 06:39:27.674+00	2025-11-07 06:39:28.52909+00
8ecfcbae-6544-45b2-af49-9c7771e810e7	0308507801	1	time_in	2025-11-07 06:39:32.537+00	2025-11-07 06:39:31.430813+00
e051baa6-ef63-40ad-91f8-5d604d15c1bc	0299046841	1	time_in	2025-11-07 06:40:16.663+00	2025-11-07 06:40:15.566016+00
30f76288-3754-48b7-ac00-711467e81c99	0293022537	1	time_in	2025-11-07 06:40:42.179+00	2025-11-07 06:40:43.03622+00
57c2cdde-3076-4aa0-b15b-810e8e0acfe1	0293081065	1	time_in	2025-11-07 06:40:59.632+00	2025-11-07 06:40:58.529097+00
06a55350-0674-4dd5-8d1b-ad90045e407b	0299296473	1	time_in	2025-11-07 06:41:45.555+00	2025-11-07 06:41:44.448662+00
31d2a9fd-530d-4b87-a712-abc39abcb02f	0305727129	1	time_in	2025-11-07 06:41:45.685+00	2025-11-07 06:41:46.547745+00
7d627d1b-0758-4002-8de4-b953ce2c5b08	0299534281	1	time_in	2025-11-07 06:42:32.505+00	2025-11-07 06:42:31.409683+00
b32618d3-b37f-4ac7-971f-c87b08c0c982	0305875737	1	time_in	2025-11-07 06:42:32.13+00	2025-11-07 06:42:33.004013+00
cbb2c218-2341-4b16-9e6e-bf8842541f6a	0299315913	1	time_in	2025-11-07 06:43:26.119+00	2025-11-07 06:43:26.988342+00
cd6474ce-933d-44d2-a8fd-cbc1685b1932	0310240825	1	time_in	2025-11-07 06:43:31.092+00	2025-11-07 06:43:29.98753+00
b0428b33-db29-4e8e-940f-8a75b4fc8faa	0307577945	1	time_in	2025-11-07 06:45:20.475+00	2025-11-07 06:45:19.380702+00
592afb44-a6f2-4f0d-be24-fc249817810a	0306401673	1	time_in	2025-11-07 06:45:23.819+00	2025-11-07 06:45:24.699126+00
958a033f-6d8f-4693-b756-09ccc24cc482	0310215897	1	time_in	2025-11-07 06:44:33.343+00	2025-11-07 06:44:32.242427+00
a884b24e-e137-4185-af03-795d199fccdb	0309301033	1	time_in	2025-11-07 06:50:29.465+00	2025-11-07 06:50:28.380162+00
0ef8e5d0-ec4f-425c-a9e8-57775b65454a	0293050969	1	time_in	2025-11-07 06:51:39.186+00	2025-11-07 06:51:38.106328+00
61fe2fee-9bcc-4b96-8b46-c0bfea76f532	0298351385	1	time_in	2025-11-07 06:52:20.791+00	2025-11-07 06:52:21.683787+00
7f6dae3b-3a79-4a91-96ba-1242078b3d40	0309630361	1	time_in	2025-11-07 06:52:28.194+00	2025-11-07 06:52:27.099714+00
f879cf6a-6a19-4e40-a351-05e56df497e0	0308561833	1	time_in	2025-11-07 06:53:12.338+00	2025-11-07 06:53:11.233799+00
bd31d15d-145b-4662-9ffa-1e9a9fd9d8a4	0292293337	1	time_in	2025-11-07 06:53:38.425+00	2025-11-07 06:53:39.312596+00
3707cf37-597b-48c2-8480-c7f4d65410f7	0298838281	1	time_in	2025-11-07 06:54:11.456+00	2025-11-07 06:54:10.353418+00
45fd23f3-4ce0-4088-90d5-1a084c1f8763	0308432841	1	time_in	2025-11-07 06:54:19.02+00	2025-11-07 06:54:17.91984+00
353b2c41-2364-4031-84ea-41cbdbba35be	0291973721	1	time_in	2025-11-07 06:54:21.375+00	2025-11-07 06:54:20.269146+00
99af1a20-d386-43d0-ae19-9fd0b33ffb86	0308039577	1	time_in	2025-11-07 06:54:23.974+00	2025-11-07 06:54:22.867019+00
de9c0781-c2b4-4082-bc86-007a3a08f4fe	0296807385	1	time_in	2025-11-07 06:54:27.047+00	2025-11-07 06:54:25.950611+00
0f24dc1e-30f8-465a-b7ae-2aadca28ac92	0296807385	1	time_in	2025-11-07 06:54:27.731+00	2025-11-07 06:54:26.629499+00
df37de0e-beab-473f-8190-cde67820b1b8	0292424393	1	time_in	2025-11-07 06:54:29.644+00	2025-11-07 06:54:28.553253+00
a1d27f6e-b4b4-40c3-80b9-25d5a716545a	0298967657	1	time_in	2025-11-07 06:54:32.495+00	2025-11-07 06:54:31.456055+00
809b5b30-4d04-4e10-b6dd-c9a51a4363d1	0294940121	1	time_in	2025-11-07 06:54:36.06+00	2025-11-07 06:54:34.958066+00
f49035da-f611-48e5-9484-989b9eccec85	0292210489	1	time_in	2025-11-07 06:54:38.268+00	2025-11-07 06:54:37.162852+00
4b0895e5-69a9-47a2-891c-99bbfca36cea	0305445241	1	time_in	2025-11-07 06:54:43.047+00	2025-11-07 06:54:42.023993+00
79793c7b-3aee-461a-919b-4764290b143a	0309182473	1	time_in	2025-11-07 06:54:46.521+00	2025-11-07 06:54:45.416433+00
1cca9549-7eb2-45c4-bc32-41416fde79b7	0291673481	1	time_in	2025-11-07 06:54:50.014+00	2025-11-07 06:54:48.928331+00
f872b28f-81c1-4582-af72-29f40e9eac0f	0297385625	1	time_in	2025-11-07 06:54:53.142+00	2025-11-07 06:54:52.05288+00
3dd59f74-a7f4-4bfe-8587-fdb3f58ddea9	0297364553	1	time_in	2025-11-07 06:54:56.288+00	2025-11-07 06:54:55.192658+00
54fe0eac-d6ff-4f0e-a783-c47a7cdf8e71	0299325577	1	time_in	2025-11-07 06:55:16.09+00	2025-11-07 06:55:16.978083+00
da66a1c0-703d-457f-8ac9-ad80cb1e64be	0299103609	1	time_in	2025-11-07 06:58:38.647+00	2025-11-07 06:58:39.561453+00
9bd2f013-7470-4c83-8dec-08ddc086a3ac	0297377865	1	time_in	2025-11-07 06:58:43.729+00	2025-11-07 06:58:44.625183+00
241d485f-fd9f-4b4d-96da-25808f12d84a	0291955241	1	time_in	2025-11-07 06:58:47.464+00	2025-11-07 06:58:48.393036+00
16e32eab-9838-4836-8371-2b7573581430	0292308905	1	time_in	2025-11-07 06:59:14.516+00	2025-11-07 06:59:15.440356+00
fe5a6bc7-5324-404d-a2be-98e131df00c9	0297543305	1	time_in	2025-11-07 07:03:10.005+00	2025-11-07 07:03:10.913089+00
fbf8052a-c52f-42c6-a8a6-5ab315364895	0298117273	1	time_in	2025-11-07 07:04:36.286+00	2025-11-07 07:04:37.195468+00
4d056a61-4fb4-4111-9461-e34aef18b6dd	0306985785	1	time_in	2025-11-07 07:06:10.436+00	2025-11-07 07:06:11.346575+00
20742186-d230-4599-8fd5-562e7defe24b	0305586697	1	time_in	2025-11-07 07:07:57.716+00	2025-11-07 07:07:58.617657+00
fa2aa3eb-ace4-481e-b211-8a21ce6ebb72	0305382537	1	time_in	2025-11-07 07:08:52.255+00	2025-11-07 07:08:53.152886+00
7ebefcc0-3a77-4bc5-9ab8-ae58f8a78c6b	0305692953	1	time_in	2025-11-07 07:10:17.135+00	2025-11-07 07:10:18.033677+00
dd01f63d-e338-49cf-bd2d-35649753ee16	0310416377	1	time_in	2025-11-07 07:13:46.782+00	2025-11-07 07:13:47.670263+00
4200c755-cb04-4c9c-af7f-5d2526010e67	0305378185	1	time_in	2025-11-07 07:15:04.6+00	2025-11-07 07:15:05.485581+00
a812e400-c6fd-46d0-8619-58452417a4f8	0300924777	1	time_in	2025-11-07 07:16:02.663+00	2025-11-07 07:16:03.546261+00
9ae4ba15-a148-40db-8710-4405d4d07f3a	0292914633	1	time_in	2025-11-07 07:17:30.695+00	2025-11-07 07:17:31.611431+00
745464a1-8de0-42d0-b3ec-e61a597cc76f	0299308185	1	time_in	2025-11-07 07:18:45.794+00	2025-11-07 07:18:46.666476+00
03894f92-d896-426a-8995-1584a5db7310	0299130425	1	time_in	2025-11-07 07:21:33.954+00	2025-11-07 07:21:34.821984+00
c88cd91c-9349-4003-893c-0360f5dd95d1	0305697017	1	time_in	2025-11-07 07:24:14.755+00	2025-11-07 07:24:15.706901+00
c499b090-5bb8-46c0-b7aa-5c9ab30336e4	0293119129	1	time_in	2025-11-07 07:26:33.114+00	2025-11-07 07:26:33.983922+00
460ed065-f543-4eeb-a84c-e152cf2585c1	0300983209	1	time_in	2025-11-07 07:27:48.085+00	2025-11-07 07:27:48.947464+00
29c3735e-7c36-465e-bf92-80faade807c6	0117175945	1	time_in	2025-11-07 07:28:42.076+00	2025-11-07 07:28:42.941269+00
440c70e2-1984-41e4-9a7e-98bdb2e45a38	0310126089	1	time_in	2025-11-07 07:30:40.17+00	2025-11-07 07:30:41.029349+00
8fe09ccd-dc02-4393-bbdf-787ad88a0bb3	0292916473	1	time_in	2025-11-07 07:32:19.928+00	2025-11-07 07:32:20.806766+00
7ca3a819-583d-40c6-ae8a-76a803cfbe49	0310046601	1	time_in	2025-11-07 07:34:10.496+00	2025-11-07 07:34:11.365982+00
08a518e0-98b2-4fb8-8d44-d480c6b1a937	0294896521	1	time_in	2025-11-07 07:37:59.799+00	2025-11-07 07:37:58.568856+00
cc73be79-282a-4a0a-8521-59ba47767c8d	0304192553	1	time_in	2025-11-07 07:38:02.228+00	2025-11-07 07:38:03.095766+00
fc890e0f-fc8d-4176-af6a-a459ee1c6be6	0305765241	1	time_in	2025-11-07 07:39:35.021+00	2025-11-07 07:39:35.879319+00
1b1278ea-dab5-4fe4-b2fd-d4a9670ab6ce	0306344873	1	time_in	2025-11-07 07:40:23.818+00	2025-11-07 07:40:22.584839+00
e2a6288b-f774-4991-8e9a-90d789322246	0294935401	1	time_in	2025-11-07 07:40:44.818+00	2025-11-07 07:40:45.679313+00
c3f9f18e-54d8-4ad3-baf3-232ec12f1fd9	0309266489	1	time_in	2025-11-07 07:42:13.259+00	2025-11-07 07:42:12.032018+00
843a4765-93d0-408d-b93a-738f2c44a4ba	0309210105	1	time_in	2025-11-07 07:42:49.647+00	2025-11-07 07:42:50.564634+00
8cad99d4-6b2b-44f1-a31d-1798697e1cd5	0294962649	1	time_in	2025-11-07 07:44:06.917+00	2025-11-07 07:44:05.703121+00
3485c87f-cfe6-4ec1-a52a-0a29316e7604	0299045273	1	time_in	2025-11-07 07:44:10.39+00	2025-11-07 07:44:11.277106+00
6be6ec15-e289-4f95-9e3f-85cc24fc3b96	0308372953	1	time_in	2025-11-07 07:45:27.393+00	2025-11-07 07:45:28.305068+00
d560b1a5-ca77-4625-9159-6c06b679016e	0292692057	1	time_in	2025-11-07 07:45:40.517+00	2025-11-07 07:45:39.297831+00
3620a028-f4e9-4ea5-9385-c772c2040ea3	0298865209	1	time_in	2025-11-07 07:46:50.906+00	2025-11-07 07:46:51.808903+00
080f7eed-b8c8-4c16-a8ee-f033924a854c	0298865209	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:02.966797+00
d278bde2-5074-4f41-8481-f1bf33996cca	0292692057	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:03.113277+00
e8135407-84a8-435c-bed8-68f3ce87e882	0308372953	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:03.215175+00
fe625498-30ad-4cf1-a804-070f5e3f910d	0299045273	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:03.320098+00
152e4021-5186-4eed-b8ac-70d495a82dc2	0294962649	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:03.421491+00
e91a920f-b0b5-43e3-8fa5-48b14e100e0b	0309210105	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:03.514471+00
c948893f-e7ee-4db1-bd14-4212954a1c10	0309266489	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:03.653578+00
f61d7c78-183b-441f-83ba-f081b8d3c48b	0294935401	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:03.730136+00
38c02f6d-7651-48aa-8890-7fadc178381d	0306344873	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:03.919068+00
31291ebf-cae1-4a8a-b0c5-8a8a817764ac	0305765241	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:04.024605+00
b5ca8879-05c4-45a1-84bb-bfa2d06c3c18	0304192553	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:04.13546+00
504b5df6-b700-4164-8fee-e5cde860c547	0294896521	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:04.205223+00
0480b5eb-7b2f-4141-a7f2-04868350907e	0310046601	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:04.311181+00
2fa39d95-b0c5-4905-abc1-62ab4503d843	0292916473	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:04.37333+00
3f1699b7-bc38-44fb-828e-d12f7c521561	0310126089	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:04.424956+00
6f650022-e300-441a-b103-70e4eace247e	0117175945	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.063992+00
70f68a55-6754-4a38-93a3-8709dbb9a524	0300983209	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.123209+00
34272128-ae4e-4f02-92a1-3c144d6feae8	0293119129	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.249764+00
0d9f4a1c-6d0f-4765-8b65-f98e89373043	0305697017	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.354273+00
6274bef1-cf68-4c83-b8b2-ea716e214b02	0299130425	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.430284+00
8a19bcf8-b270-4c0d-bbbb-b39418cc966e	0299308185	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.492686+00
9ea6b65e-a8ea-46b1-a5da-b899990649cb	0292914633	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.552218+00
d4118e8c-1828-4a90-b1b5-9777d9f85f4d	0300924777	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.608668+00
dfe985b3-aae2-4fa7-a0cf-bf1e3fc36e9a	0305378185	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.660598+00
11f4bfbd-82a4-45e0-85c1-320da2efdda2	0310416377	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.718079+00
e590cc27-42aa-492b-a404-041fb0ffbc41	0305692953	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.787113+00
9481acb1-8805-4004-94a2-2644185b9f75	0305382537	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.850784+00
f87b7d66-492c-4bc9-90fc-c20474e771e3	0305586697	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.909114+00
23b0e56f-ab39-42a1-91a2-637dc07e52fe	0306985785	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:05.965814+00
632bdb0f-1ebf-448f-ab82-b573240eba2d	0298117273	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.031407+00
0e1a4a3c-90e9-4c36-9607-60a4ba0e68e9	0297543305	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.0895+00
4384cdce-babf-43b2-a005-2a4a8ed66559	0292308905	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.157377+00
2d196ea0-7a05-43ce-8a33-1a4378999a33	0291955241	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.21485+00
86075da7-55d5-4b25-807a-c80727d554d9	0297377865	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.284896+00
af0b8cd0-ac86-463c-b1cf-d1ed484eae9c	0299103609	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.350189+00
9b7fef96-0f1d-4e4e-b7be-fc5be65e4d06	0297385625	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.539042+00
f0e64e57-9431-4d90-9b9a-fa8df706d690	0305445241	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.728618+00
bb78b14f-d944-40fb-93d9-b027f7123014	0298967657	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.943653+00
6a2c06fa-a65b-4dfb-86bf-29aaa2f6159c	0296807385	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.118773+00
a3b570ec-ada6-4f1c-be5c-342eec8326a9	0308432841	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.317623+00
71f973d4-7571-4dcb-bf5e-d59248e67cbc	0308561833	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.521414+00
b84fbcae-3daf-40b0-81d2-a225406a8f4e	0293050969	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.698232+00
85530e3f-8140-488a-a256-113820c3e062	0307577945	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.864529+00
9b6a74e6-52c7-407e-add5-42bbdc23a8fb	0299315913	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.040712+00
c60e7d1c-e0c8-4301-8d2d-1e4584f85103	0305727129	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.265746+00
2bcaaf78-a509-4bac-b2a3-137da7a1f6f0	0293022537	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.467127+00
bdb207b6-22d1-4269-ac6b-31f608e468b0	0291865289	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.672837+00
1b6d1897-8245-4e46-aa79-cef78a9333dc	0298922889	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.84734+00
99eeb224-6795-414d-aeb4-86be937589b3	0308301369	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.017849+00
22b954be-813b-45da-b270-f45e9a7d0687	0305588489	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.206873+00
6e6e7cfe-57f8-45e6-b8df-7d8598ee6bb6	0309725945	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.385066+00
84dad0c3-6bf5-47a6-85ee-91862acad427	0305499433	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.58715+00
99be5878-122b-4de2-800d-dcd9dbb9ec2c	0308566713	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.787778+00
8676748b-31fc-420e-a591-81eabcf83afb	0296836713	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:10.023549+00
cebdbb53-f47f-4b9f-a1c3-29b2d5d88810	0305101593	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:10.264886+00
d55db8c5-1151-4b41-8f1c-b192008da4a9	1100979479	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:10.427562+00
172c45b6-f17e-4297-b834-2d4848a1254b	0296634233	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:10.841071+00
9d39197e-8e36-4814-91b1-a83b1bee5e62	0304953593	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.074311+00
9acc4a37-3c28-439b-8421-a88c53581530	0307877113	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.283266+00
41ad65c2-dfc4-4a85-8165-b37c4bc37bad	0308477257	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.522971+00
56773628-bde6-428c-b19e-72e9bed90aca	0308557449	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.708378+00
6bce0f24-7d93-46f3-9c23-c39048a81115	0306322841	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.888874+00
25063de6-45ed-4142-84c0-920d9b8aa5bb	0306022393	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.098262+00
684a23d3-7c1a-4e80-8cfd-2ef24aeef8b5	0307406985	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.275373+00
a278dfbb-8456-404e-b648-5450f99c920b	0309574841	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.436698+00
bfc39a36-7706-418e-9040-96c5ee20591d	0305570809	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.59785+00
7d189dcf-6f3e-4e56-8a44-ea16327d697f	0297633897	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.823237+00
233abf66-d089-493a-8e1f-14ca71498897	0306301449	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.007054+00
5ec536bc-2696-4aa6-8949-c8fa27122798	0298255273	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.161303+00
b6c2a8dd-bf1c-45f4-a673-844dca95c404	0306494617	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.318214+00
84f6b51d-7b7b-4df4-8392-e79a33901a04	0113246345	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.486368+00
37e076a1-02a9-421a-b83b-9a8fd1db4c8f	0296861817	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.677523+00
1d33f4a0-147b-4086-8c2e-fcb6c0a7c18d	0297578969	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.839262+00
82cf0f5b-0b1d-49f2-a5c5-b9e354883c2a	0117272745	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.038174+00
83ef98f6-158a-4147-bf8e-9dbe026603ee	0298282009	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.219577+00
0e8c38ad-dead-40aa-8d86-d48ad9551a76	0112899417	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.432291+00
ee3a282e-3d59-4659-814b-b0a4a0218853	0308579001	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.606161+00
a28d5e7e-24e8-4df8-8178-3b8860ab5819	0292432825	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.789424+00
37ad6da9-82d1-47ae-a141-43a2e3f01c5a	0304416569	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.989496+00
121f0c20-eb74-4d70-acf7-edbe7633b801	0293444025	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:20.627426+00
55826628-fd83-41a7-9720-4ecfda23e065	0293477065	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:20.937011+00
fe841e60-8fa3-4faa-b9c4-09d51c3aa9b2	0293520825	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:21.539312+00
68b026d3-04a0-44e3-9a74-a3c7b365da51	0307100601	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:21.865313+00
7bc393c4-ef96-4c1c-9433-a688940adf50	0291749353	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.037743+00
cf96ecb2-ace9-4a9b-a945-3874b64c897b	0292908521	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.223098+00
cce12e69-49d2-4913-a851-e82405088c8c	0293044713	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.402948+00
23edafef-f741-44b6-8c75-068f1c80221a	0306068281	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.575754+00
7c4ce9cf-5d2c-4ab9-b533-6b4b94aded91	0309458201	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.731896+00
43be9ea1-9cd4-4b1b-8386-702dcfd23259	0293027753	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.913307+00
a5f42626-b48f-4f71-a68c-cc3bdcb9e392	0306172985	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.071446+00
52e78e50-1fec-4c5f-b094-cd25e62ee692	0305619497	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.238161+00
cbd0c648-736d-491e-bfa6-4acae85e3e96	0308559609	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.426949+00
676c9b7f-3754-4e77-834c-3fae3646a05a	0306026953	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.599884+00
8d680c58-091f-4076-9bf1-09bbc074330f	0307007017	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.776876+00
d510cec9-c3f0-476a-ad1c-1a74f531cc4b	0299325577	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.418244+00
6c094e3b-847f-40db-a0e1-4a0712cbf5c9	0291673481	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.614787+00
4aef55cd-b2f0-4f28-8962-fd016e9918a3	0292210489	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.799868+00
2870f741-abbb-454d-9a33-45c94b8d62c8	0292424393	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.996744+00
0354b749-8c24-462a-b92d-2c1467329661	0308039577	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.179042+00
dabadfb0-79a3-410c-a710-22cd4c0ba8fa	0298838281	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.375375+00
2501ca70-2792-4980-969b-2880ffeb51a7	0309630361	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.58324+00
40b75641-8051-4443-a9e1-507f6272c922	0309301033	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.752705+00
9f497805-73d4-4657-8311-caeedea70225	0310215897	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.918016+00
2a8e1c81-45a8-4465-89e8-5db88613ceac	0299534281	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.119736+00
43c42947-4923-414b-b512-abf2694cb06c	0299296473	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.339785+00
57a1de99-05b9-4a56-bf54-a1bd099b0cb9	0299046841	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.54101+00
1ad03cf2-023e-415b-9093-d8061f884212	0308506473	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.73058+00
3602d707-29d8-49b6-847a-bd163d89f1c5	0308578201	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.905393+00
820a6786-a0c2-4d9f-8997-a88d5047818d	0308018329	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.080788+00
93d645a6-8d5b-4454-946b-654ba5141eab	0309377641	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.273686+00
0833c746-a88b-4ec9-bac7-bb4a40c39974	0293000713	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.438259+00
8796ded1-455e-49e4-badc-8d107f360a5f	0305499433	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.660655+00
56fc7e7d-b859-442d-bc24-13c83f503c1b	0295114121	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.851623+00
1714c33a-af15-4195-befc-1529536581e8	1100972749	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:10.143177+00
527f1643-1b43-4b20-9ed2-e6ad9f68eebc	0309381401	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:10.321476+00
088e50bb-d50d-4bb6-b853-cddd12d4ba4d	0294788905	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:10.482773+00
bda34108-8e16-4cc5-8a75-0559701c14b5	0296852729	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:10.945715+00
27c457e4-aa1a-40bb-948c-e2069678273e	0294859689	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.130228+00
91c566c1-ee98-4898-8f89-7bdb5169955b	0299009897	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.335491+00
01d24cc5-6946-4fd2-ba23-8d05d993c513	0309965849	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.581915+00
3371afc5-3aaf-4189-b089-89ec9abbdfa8	0305949593	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.774426+00
97c2a7b8-279e-4654-b6d4-3f746461c17e	0292942201	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.959513+00
a5ea439f-b8db-448e-869e-49e71c714f4f	0307121449	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.157436+00
c2fc254a-dfc4-4b5e-a77c-f080afa09ba0	0310121913	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.32826+00
ad470715-ae6f-4935-bc68-14ff5e9c9530	0305627897	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.487234+00
8f4914ce-fefc-4bce-aa7d-e5cf060e08e8	0297694825	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.660649+00
94781ee1-4990-4ab6-a709-174116dd9b17	0310401145	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.887328+00
22f147b2-470d-4de8-b150-d790099cbc95	0307180281	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.056975+00
be7ec472-e622-420e-b755-9739fb308bbb	0293000041	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.211733+00
00b11e36-e796-49d8-94db-3daa46c7401d	0297448905	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.376518+00
280f8e6e-0402-4c9a-93a5-ec2fa943ab05	0293100617	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.548279+00
884762b7-4424-4980-89f8-5fe62bf66b1b	0291714329	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.735299+00
6b6b6915-6be2-4ad4-9005-8051b37c9a4d	0304571641	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.898847+00
5d263c36-cfad-43a9-9a85-3b9abcc3d84c	0297680185	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.116168+00
ea96263b-f477-450c-a67c-a041436d623a	0305869721	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.303389+00
8159341d-617b-4647-915d-6c77c3f46b4f	0305476025	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.491292+00
8a25bf88-19e3-4d96-ad88-e9ff47b9f08c	0299039577	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.669764+00
244765c1-8642-48bb-9d48-f7f6bc134c99	0124062361	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.8451+00
7dd0dc4d-b9c3-412c-bc7d-3a7993898d7f	0304798761	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:15.069231+00
448d518d-aca5-4929-810a-f84a2df1d907	0292613097	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:20.752977+00
b19f94c0-80b0-4f61-b1dd-1a65c3acfc6e	0293955785	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:21.149792+00
b3698b32-7d93-4c16-8153-d5d01a9530e9	0304652201	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:21.702095+00
5a793fe2-1495-47ae-8a37-da7cff4f08eb	0305533561	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:21.932438+00
3bd2ef6b-60b6-4df1-bb0d-54b1fdbedd6e	0305746521	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.097657+00
846c11ff-efe8-40d8-93b9-86fead0056b2	0297266233	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.286544+00
28553eca-0e0b-4b7a-838f-54b6985d2faa	0297614649	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.455502+00
23ec0cd1-9994-42ac-9e73-86fc3ac14bf1	0297083833	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.630158+00
a2e7007d-7b1b-467d-8603-340a915ba76f	0310093193	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.784404+00
c3ee521a-255c-4801-81d2-201c435dd701	0295216089	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.966307+00
8a0c6399-1df0-4b68-b5ba-c003ea56935a	0308402953	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.125098+00
eacc539d-00c3-474d-bf26-83234d1a3116	0296846777	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.30295+00
413dd9c0-6d90-4ad9-824b-72a0e47739bb	0292815465	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.47932+00
90e5513b-b0e5-4189-a79e-a101c4eda03f	0295359849	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.670083+00
ec4e0084-1083-4ca1-8ee7-f7c4517b2a50	0297364553	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.480433+00
68ff64c0-4694-4e89-9e4a-3078d33fca71	0309182473	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.669784+00
00a46fee-5c6c-4328-8b33-5870c48f8592	0294940121	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:06.863616+00
9aec5555-4950-4787-9c60-c98dec4d623c	0296807385	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.05623+00
afa56aae-62bf-4d25-a6c9-cf1cec9ac620	0291973721	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.249099+00
34d9f89c-9dd7-432a-8443-80a6ff253d98	0292293337	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.452062+00
808f29ab-b1b7-487d-bfe4-3d2182752fd2	0298351385	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.632966+00
3d22b21e-310e-4414-8a90-f00bc9cc9c21	0306401673	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.809702+00
f6d26e37-278f-49b5-bd46-0041e0cf9772	0310240825	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:07.981528+00
0bab02cb-2b13-449d-becc-cb4bc0a5fc37	0305875737	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.190406+00
413d21ad-60f9-453c-8635-9f7e1b82e2a7	0293081065	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.398789+00
b5d9058a-a819-46ca-8ad1-9eae5ecb9a4c	0308507801	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.61546+00
66acea4b-00b3-4700-af83-0c23f17bfcd6	0299159369	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.788915+00
be2dcbdf-e368-4df3-8024-02a12ca4555d	0306944297	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:08.958784+00
26f393ae-d09a-45ed-bd0e-f9df5092f81f	0307414297	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.159604+00
cfab89f7-37de-4792-900d-fe2bcadeef57	0308352153	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.326863+00
73789f6a-3ed3-44b6-99a7-8569b2ace27a	0296896249	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.516592+00
63b52fd7-457a-4c5c-8939-d3578e3517e9	0309864537	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.729221+00
54f5dc2a-2eb3-4b7f-bf49-c54a21f2b0f0	0298966905	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:09.929501+00
a049e776-fa2c-44be-82b4-0281fc04835a	0294884089	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:10.204565+00
ca75fa4e-cc4f-4df8-89be-84100b3acdd0	0293506217	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:10.373482+00
83cf148f-f296-4610-aa53-c674e73d7bbe	0292048985	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:10.551161+00
7e880189-5860-450b-8d3b-481b7c55e487	0309289673	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.009135+00
5bcda862-784e-4570-824e-658f5212e7b6	0294859689	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.222396+00
7b23b0e7-04c3-4537-abb1-9ed3de49ff13	0294998313	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.402334+00
29f9f55f-996f-416c-af0c-e4a6473aca7c	0308821929	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.648195+00
a1799dd7-77fd-41ff-b29b-87d07ef02078	0297567977	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:11.831454+00
552a2104-239f-45ec-87ae-5f65f2426104	0306921865	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.040371+00
339d6b80-9316-4585-9cdc-9fad246a792b	0298412537	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.213925+00
57d49fb6-c7e6-4540-8889-331ef5bf82f2	0297650569	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.386887+00
d35798de-15db-4ed3-9794-03ea4bd777ec	0117089033	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.544879+00
cf31ae71-9894-4a24-aa4e-cbf07314e39a	0305760169	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.756024+00
91d5fdc8-d167-4c27-bfbb-ba040b9409b0	0297698745	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:12.943458+00
0a320e96-1419-4ab0-839e-831d2dbb8ae7	0306088873	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.104753+00
9084679a-59ba-4628-ad97-2bdf194de9e6	0297391097	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.265051+00
a3367f81-a4c3-46be-bba3-8e4f84db55f8	0306337113	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.433058+00
7c734d4e-91fe-42bf-ad65-aa99daa38c57	0296861817	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.616701+00
a0f54015-65f1-485c-9362-67ab5896a7ba	0295045993	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.790719+00
a728571d-2265-4ee2-afcc-8668f653d0eb	0116763193	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:13.983492+00
8cc9beba-951d-41ee-8e3f-ef559ba590fc	0309481689	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.166928+00
cf5f4b78-14bf-464d-8155-7823da1877aa	0298120377	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.372031+00
4d1a9561-1ed3-4fe3-8ee4-4888b755ef8d	0292224105	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.547585+00
a855d8d0-d653-42ed-a98a-cf253726ebf2	0305632073	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.735676+00
be97debf-464f-4820-8a52-fe9976e1806d	0122532889	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:14.891105+00
f427d9a7-b4d5-48c7-a1b8-0fd6a1e8065d	0291844777	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:20.443132+00
94afbdde-8f5d-4e02-8435-9dda9aa8474a	0292613097	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:20.854065+00
eff62f19-a8b0-4cb7-8579-50ee65e3c583	0293441241	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:21.435182+00
7f6738f7-96b6-45ad-bcfb-447555705dc1	0304711385	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:21.80173+00
937e96cc-0c14-4eb6-b4c3-f816607e45d7	0304731241	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:21.988675+00
38c7de07-1619-486b-b322-3cf04ca5081e	0304567881	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.158401+00
6ab6129c-e05d-4aef-adbd-044bae260f9d	0291773817	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.349422+00
3dbc20b2-3986-4d04-a405-d8bf6f33f3a3	0305764601	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.504283+00
bfdc8994-874b-4688-873f-c17c8fefd0cb	0291935785	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.679923+00
1423c1e5-0c51-4f6b-a481-4240e06cef92	0294715225	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:22.839675+00
31f16cb0-c63a-4945-a7fc-65545ab53fb9	0305740041	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.022304+00
5dd3f4b4-4ff6-422b-b825-f58e9d58b821	0306191849	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.181129+00
c4424a63-91c2-467e-8cf3-c86bfb684b7a	0298837641	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.365466+00
d02a7a9b-a372-44c1-a5e6-1431295df102	0305675017	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.542945+00
e0d87c70-518b-4632-b07d-f455ddd09829	0306046265	2	time_out	2025-11-07 10:00:00+00	2025-11-07 10:00:23.722598+00
\.


--
-- TOC entry 4454 (class 0 OID 17915)
-- Dependencies: 386
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."students" ("id", "first_name", "middle_name", "last_name", "suffix", "lrn", "created_at", "gender", "rfid", "grade_section_id") FROM stdin;
252	Zyrus Jhon	G.	Fernando		109482220022	2025-11-07 06:45:14.363763+00	Male	0307577945	13
41	Zoe Jamila	V.	Aplacador		109481230062	2025-11-03 05:00:14.171805+00	Female	0308147193	7
42	Alvi	S.	Cullamco		109481230095	2025-11-03 05:03:50.18554+00	Female	0308081913	7
118	James Jared	C.	Fabian	\N	109481210007	2025-11-07 03:44:38.066619+00	Male	0308579001	20
115	Jorim	Dc.	Albino	\N	109481210251	2025-11-07 03:43:29.815252+00	Male	0305632073	20
21	Kratos	P.	Capili	\N	109481210154	2025-11-03 03:26:41.003061+00	Male	0293477065	20
140	Alexander Brian	C.	Deris	\N	109481210103	2025-11-07 03:54:06.517039+00	Male	0293100617	20
136	Adriel John	Dc.	Ebo	\N	109481210104	2025-11-07 03:52:44.804273+00	Male	0291714329	20
20	Romar	C.	Yaniza	\N	109481210060	2025-11-03 03:25:26.536571+00	Male	0304711385	20
123	Precious Rowie	L.	Jose	\N	109481190199	2025-11-07 03:47:05.122879+00	Female	0298120377	20
154	Jaliyah	V.	Jalimbawa	\N	109481210034	2025-11-07 04:01:26.642585+00	Female	0297633897	20
23	Aira Maine	M.	Jose	\N	109481210090	2025-11-03 03:28:43.933708+00	Female	0293441241	20
27	Franzhen	B.	Liva	\N	109481210016	2025-11-03 03:32:52.367861+00	Female	0304798761	20
22	Jannah Kim	A.	Punay	\N	109481210038	2025-11-03 03:27:40.644516+00	Female	0293520825	20
28	Julianna	A.	Quimbo	\N	109481210192	2025-11-03 03:33:49.194515+00	Female	0292613097	20
120	James Carlo	A	Garcia	\N	109481210252	2025-11-07 03:45:52.143384+00	Male	0305476025	20
88	Zeus  Kharl	A.	Montejo		50102720018	2025-11-07 03:28:11.591121+00	Male	0306172985	25
91	Arkin Trevor	S.	Prado		109467190197	2025-11-07 03:29:24.865037+00	Male	0295216089	25
93	Shian Kenrick	M.	Serrano		109487200073	2025-11-07 03:30:44.184384+00	Male	0294715225	25
95	Xyrus	C.	Pacios		123629200006	2025-11-07 03:32:04.054906+00	Male	0309458201	25
97	J. Gabriel	S.	Batuigas		109481200154	2025-11-07 03:33:10.950149+00	Male	0297083833	25
99	Jaewin Samantha	P.	Espepi		109481200221	2025-11-07 03:34:20.969004+00	Female	0305764601	25
101	Kendra	L.	Mendoza		109481200186	2025-11-07 03:34:56.085284+00	Female	0293044713	25
105	Marian	M.	Sierra		109481200117	2025-11-07 03:36:34.301411+00	Female	0304567881	25
33	Jheicel	D.	Caro		109481200073	2025-11-03 03:45:07.523874+00	Female	0308372745	25
103	Chelsea	A.	Moral	\N	109481200095	2025-11-07 03:35:37.270066+00	Female	0297266233	25
107	Meridel	A.	Jardin		109469200542	2025-11-07 03:37:55.38437+00	Female	0304731241	25
109	Venilyn Blaine	A.	Villezar		109481200213	2025-11-07 03:38:59.965453+00	Female	0305533561	25
111	Angela Nicole	F.	Floria		109481190196	2025-11-07 03:40:18.517819+00	Female	0291844777	30
113	Bryle	D.	Derilo		109481180085	2025-11-07 03:42:12.291651+00	Male	0124062361	30
34	Mark Jacob	A.	Reyes		109481200205	2025-11-03 03:46:06.299884+00	Male	0305619497	25
125	Princess	B.	Valeriano		1094810000000	2025-11-07 03:47:56.045989+00	Female	0305869721	30
127	Aicelle	V.	Bernal		109481190044	2025-11-07 03:48:43.921828+00	Female	0309481689	30
129	Jenoey	P.	Rabago		109481190043	2025-11-07 03:49:44.522294+00	Female	0117272745	30
132	Rose Cathleen	D.	Campo		109481190155	2025-11-07 03:50:40.974964+00	Female	0116763193	30
134	Leo	C.	Paramio	\N	109481000	2025-11-07 03:51:29.121847+00	Male	0304571641	30
143	Dashina	M.	Apostol		109481190106	2025-11-07 03:55:45.951238+00	Female	0306337113	30
145	Yumi Frencheska	C.	Bautista		109481190108	2025-11-07 03:56:36.688523+00	Female	0306494617	30
147	Francesca Louise	B.	Villanueva		500333190180	2025-11-07 03:58:17.301588+00	Female	0293000041	30
149	Kurt Marky	C.	Galgo		109481190003	2025-11-07 03:59:14.519792+00	Male	0306088873	30
156	Jiro	S.	Billedo		109481190059	2025-11-07 04:01:43.316198+00	Male	0305760169	30
158	Wilson	S	Fuentes	Jr	109481170028	2025-11-07 04:03:06.024924+00	Male	0305570809	30
160	Louis Alvaro	F.	Logioy		403106190049	2025-11-07 04:04:10.919561+00	Male	0117089033	30
163	Cloud Ysmael	B.	Manzano		109481190171	2025-11-07 04:05:08.021483+00	Male	0305627897	30
164	Nathalie Jade	C.	Sillon		109481190089	2025-11-07 04:06:02.846611+00	Female	0309574841	30
165	Cristine Nicole	G.	Medillo		109481170241	2025-11-07 04:06:46.836347+00	Female	0310121913	30
253	Jennyca Jane	Taburada	Mabignay		109481220232	2025-11-07 06:45:18.489061+00	Female	0306401673	13
17	Michaeila Marie	D.	Andres	\N	109481210009	2025-11-03 03:21:20.768065+00	Female	0304652201	20
144	Cjie	T.	Celetaria	\N	109481210211	2025-11-07 03:55:57.390073+00	Male	0297448905	20
148	Marco Renz Jozsef	G.	Arrogante	\N	109481210098	2025-11-07 03:58:45.536227+00	Male	0298255273	20
133	Elaizzel Rose	S.	Boredor	\N	136682210209	2025-11-07 03:50:46.738463+00	Female	0297578969	20
146	Alissa Yuna	D.	Juego	\N	136547210262	2025-11-07 03:57:33.721218+00	Female	0297391097	20
19	John Ezekiel	R.	Laurio	\N	109481210107	2025-11-03 03:24:27.586699+00	Male	0304416569	20
24	Elisha Madie	\N	Lora	\N	109481210213	2025-11-03 03:29:42.636267+00	Female	0293955785	20
18	Gwyneth Audrey	V.	Rasay	\N	109481210145	2025-11-03 03:23:11.030788+00	Female	0293444025	20
152	Kaye Rylin	Z.	Rodrigueza	\N	109481210146	2025-11-07 04:00:30.875644+00	Female	0297698745	20
128	Kyla	B.	Rivero	\N	109481210151	2025-11-07 03:49:12.604205+00	Female	0297680185	20
126	Marian Louize	A.	Galvez	\N	109481210082	2025-11-07 03:48:05.60756+00	Female	0298282009	20
166	Kristal Gilza	C.	Mediarito		109481190074	2025-11-07 04:07:09.467873+00	Female	0307406985	30
167	Rhianne Louise	T.	Francisco		109481190035	2025-11-07 04:07:41.832475+00	Female	0298412537	30
153	Dave Jheiizhen	\N	De La Cruz	\N	109481190244	2025-11-07 04:00:49.664154+00	Male	0310401145	30
162	Jhazielle	S.	Fernandez	\N	136734190013	2025-11-07 04:04:48.617618+00	Female	0297650569	30
157	Queensly Gabrielle	B.	Francisco	\N	109481190033	2025-11-07 04:03:04.467453+00	Female	0297694825	30
80	Johan Alden	S.	Domingo		109481200006	2025-11-07 03:22:15.691856+00	Male	0307007017	25
82	Khian Argel	D.	Quadizar		109481200203	2025-11-07 03:25:04.130569+00	Male	0295359849	25
84	Christopher	F.	Reyes		109481200183	2025-11-07 03:26:17.183077+00	Male	0292815465	25
325	Lasker Oz	J.	Luceña		109481240044	2025-11-07 07:46:46.782607+00	Male	0298865209	3
256	Hannah Khuleen	D.	Aguerra		109481200030	2025-11-07 06:50:16.51526+00	Female	0309301033	25
90	Charles David	F.	Sebetero		10948120019	2025-11-07 03:29:08.004033+00	Male	0305740041	25
92	Jean Kaizer	D.	Santillan		109481200118	2025-11-07 03:30:08.516175+00	Male	0293027753	25
94	Jovie Macarius	B.	Hofileña		10948120028	2025-11-07 03:31:58.415716+00	Male	0310093193	25
96	Lyra Mae		Bassig		109481200191	2025-11-07 03:32:41.962452+00	Female	0291935785	25
98	Raighne Cassianie	E.	Cala		136687200352	2025-11-07 03:33:35.149522+00	Female	0306068281	25
100	Sean Nathan	S.	Moral		109481200015	2025-11-07 03:34:31.370456+00	Male	0297614649	25
102	Shanna Hyuna	M.	Hipolito		109481200092	2025-11-07 03:35:33.837093+00	Female	0291773817	25
104	Ma. Sofia Carmelle	B.	Mamanao		109481200174	2025-11-07 03:36:25.096083+00	Female	0292908521	25
106	Ma. Shamel	V.	Valenciado		109471200216	2025-11-07 03:37:13.488506+00	Female	0305746521	25
108	Ashley Nicole	F.	Roja		109481200217	2025-11-07 03:37:57.471543+00	Female	0291749353	25
110	Jelian	B.	Siladan		223502150397	2025-11-07 03:39:09.945188+00	Female	0307100601	25
112	Daniella Chanele	I.	Payno		136640190260	2025-11-07 03:41:23.193432+00	Female	0122532889	30
114	Ashleigh Kayth	C.	Ocampo		109481190039	2025-11-07 03:43:21.93277+00	Male	0292432825	30
116	Therence Miguel	D.	Tanawit		109481190102	2025-11-07 03:44:12.914941+00	Male	0299039577	30
260	Graceil	B.	Rances		109481200127	2025-11-07 06:53:06.81445+00	Female	0308561833	25
119	Steven Andrew	P.	Sanuco		109481190103	2025-11-07 03:45:08.383742+00	Male	0292224105	30
121	Anika Katniss	M.	Mallari		109481	2025-11-07 03:46:31.379622+00	Female	0112899417	30
262	Anria Samantha	P.	Esteban		109481200088	2025-11-07 06:54:05.238276+00	Female	0298838281	25
135	Allen Iverson	S.	Hernandez		109481190061	2025-11-07 03:52:18.371035+00	Female	0295045993	30
137	Gerald Ivan	M.	Pana		109481190063	2025-11-07 03:53:23.106141+00	Female	0296861817	30
141	Haelarie	P.	Arsenio		136741180031	2025-11-07 03:54:44.22095+00	Female	0113246345	30
60	Isabela	G.	Abella	\N	1094811190188	2025-11-03 06:17:58.900977+00	Female	0309182473	30
35	Calix Angelo	C.	Pulvera		109481200222	2025-11-03 03:47:03.427372+00	Male	0298837641	25
36	Anika	U.	Sentillas		109481200187	2025-11-03 03:47:54.627525+00	Female	0308402953	25
37	Athena Abigail	M.	Ramos		109481200042	2025-11-03 03:48:51.934358+00	Female	0306191849	25
38	Kiefer John	L.	De Torres		109481230016	2025-11-03 04:49:44.157867+00	Male	0291757897	7
39	Mavin Jes	L.	Fabul		109481230037	2025-11-03 04:53:34.733493+00	Male	0291623817	7
40	Rohan Joyce	P.	Frondozo		109481230030	2025-11-03 04:57:27.062236+00	Male	0306098393	7
204	Rhyz Jaydee	G.	Yap		109481210206	2025-11-07 06:00:46.625965+00	Female	0305932249	20
150	Marc Brix	R.	Abucay	\N	109481210210	2025-11-07 03:59:31.951255+00	Male	0307180281	20
175	Mikaella Pia Lyn	G.	Callora	\N	109481210010	2025-11-07 04:14:22.584696+00	Female	0305949593	20
169	Clarence Angelo	V.	Claudio	\N	109481210066	2025-11-07 04:08:13.461727+00	Male	0307121449	20
171	Cralene Angela	V.	Claudio	\N	109481210029	2025-11-07 04:09:53.758413+00	Female	0306921865	20
176	Ayesha Lorreine	M.	Dare	\N	109489210286	2025-11-07 04:15:30.391211+00	Female	0308557449	20
174	Emily Raine	S.	Dela Cruz	\N	109396210539	2025-11-07 04:14:06.618033+00	Female	0297567977	20
179	Ruzzell Nathan	S.	Fuentes	\N	109481180123	2025-11-07 04:16:55.403978+00	Male	0309965849	20
180	Dennis	L.	Llantino	\N	10516120035	2025-11-07 04:17:50.365647+00	Male	0294998313	20
184	Kelsie Andrei	L.	De Torres	\N	136684210554	2025-11-07 04:34:05.530963+00	Female	0294859689	20
185	Jared	E.	Macasero	\N	109481210081	2025-11-07 04:34:54.602914+00	Male	0304953593	20
177	Alden	L.	Santos	\N	109481210056	2025-11-07 04:15:36.855744+00	Male	0308821929	20
183	Raem Luke	J.	Roldan	\N	109481210109	2025-11-07 04:33:57.781076+00	Male	0307877113	20
181	Jiro Son	S.	Arbitrario	\N	109481210002	2025-11-07 04:32:53.306333+00	Male	0299009897	20
178	Ramona Marie	D.	Regidor	\N	109481000000	2025-11-07 04:16:53.379408+00	Female	0308477257	20
186	Reese Abram	C.	Lansang		109495210401	2025-11-07 04:41:21.251779+00	Male	0309289673	20
173	Emrei Marist	C.	Perez	\N	109481210093	2025-11-07 04:13:15.481231+00	Female	0306322841	20
172	Russel	E.	Mercado	\N	109481210165	2025-11-07 04:11:14.617265+00	Male	0292942201	20
189	Jaiden	B.	Chinel		109481210255	2025-11-07 05:26:06.511068+00	Male	0292048985	20
190	David Seed	R.	Grospe		109481210134	2025-11-07 05:30:02.730068+00	Male	0296634233	20
191	James  Nathaniel	B.	Mamanao		109481210236	2025-11-07 05:32:45.128974+00	Male	0296852729	20
194	John Paul Beniedict	M.	Tanghal		109481210286	2025-11-07 05:44:05.369527+00	Female	0305960329	20
195	Queen Edelyn	E.	Cabral		109481210166	2025-11-07 05:49:20.558149+00	Female	0117251465	20
197	Annjhelica	S.	Galam		109481210282	2025-11-07 05:53:19.981928+00	Female	0116722169	20
202	Angel Loirain	B.	Rectin		109481210174	2025-11-07 05:58:24.284354+00	Female	0305693385	20
48	Erzikiel	D.	Sierra		109481220215	2025-11-03 05:58:05.88015+00	Male	0298966905	13
49	Eleseo	C.	Manongsong		109481220105	2025-11-03 05:59:56.045336+00	Male	1100972749	13
50	Elijah Rome	C.	Malate		109481220128	2025-11-03 06:01:22.03822+00	Male	0305101593	13
51	Timothy Emmanuel	S.	Mingi		1094812200115	2025-11-03 06:03:13.266604+00	Male	1100979479	13
52	Zade Carlisle	P.	Polonan		136481220207	2025-11-03 06:04:53.709465+00	Male	0293506217	13
53	Acy	B.	Catalan		115701220005	2025-11-03 06:05:58.821008+00	Female	0294788905	13
54	Jasmine	A.	Vargas		109481220058	2025-11-03 06:07:11.528935+00	Female	0309381401	13
55	Asia Faith	R.	Berayo		109481220066	2025-11-03 06:08:10.530711+00	Female	0295114121	13
56	Azeya Aya	S.	Suarez		109481220194	2025-11-03 06:09:43.707169+00	Female	0296836713	13
57	Madison	S.	Ricon		109481220057	2025-11-03 06:12:08.432757+00	Female	0294884089	13
58	Avril Lavigne	B.	Concepcion		1094811190109	2025-11-03 06:16:28.755975+00	Male	0296807385	30
61	Hainnah Jerissa	R.	Alimasa		408981180008	2025-11-03 06:19:30.994804+00	Female	0292424393	30
246	Raiden Sancho	L.	Tenorio		109481220064	2025-11-07 06:42:25.225287+00	Male	0299534281	13
247	Mishika Ann	K.	Reyes		109481220247	2025-11-07 06:42:27.337046+00	Female	0305875737	13
62	Alison Kate	F.	Habla		1094811190078	2025-11-03 06:20:44.697403+00	Female	0292301481	30
63	Kaeddie Yamillah	D.	Palomado		109481190085	2025-11-03 06:22:03.722952+00	Female	0291973721	30
64	Alena Gail	H.	Geronca		109481190178	2025-11-03 06:23:24.887786+00	Female	0305360425	30
65	Efreign Carlos	G.	Samarita		403101190004	2025-11-03 06:28:34.862276+00	Male	0298967657	30
66	Elna Mae	P.	Mayor		109481190083	2025-11-03 06:29:44.372999+00	Female	0292210489	30
67	Blake Collin	P.	Jamandron		109481190170	2025-11-03 06:31:27.996165+00	Male	0308432841	30
68	Zairee Ainslie	Q.	Tañon		109481190186	2025-11-03 06:34:06.121698+00	Female	0308039577	30
44	Sydney Caitlyn	P.	Gravamen	\N	109481240055	2025-11-03 05:48:02.299354+00	Female	0291955241	3
254	Adam Rei		Diaz		109481220007	2025-11-07 06:47:29.118877+00	Male	0305500089	13
170	Abegail	M.	Set		109481190185	2025-11-07 04:08:35.548726+00	Female	0306022393	30
203	Clyde Almo	Lumilang	Liwag		403104190010	2025-11-07 05:59:45.407332+00	Male	0305445241	30
79	Ethan Geil	C.	Barnachea	\N	109481200022	2025-11-07 03:20:49.290251+00	Male	0305771609	25
205	John Marvin	Catamin	Luzon		109481190006	2025-11-07 06:02:00.948467+00	Male	0306033785	30
206	Roger	Besmonte	Odnes	Jr	104427180010	2025-11-07 06:04:07.073193+00	Male	0292100137	30
196	Wilhelm Theodore	Yacas	Bayer		109481190152	2025-11-07 05:50:41.056477+00	Male	0291673481	30
198	Matt Alfred	Dela Cruz	Garcia		101281190026	2025-11-07 05:53:28.163521+00	Male	0306023497	30
207	Deniel	Del Castillo	Presnilla		112483180053	2025-11-07 06:06:26.475626+00	Male	0308621625	30
208	Prince Ace	Dela Paz	Robrigado	\N	109481190065	2025-11-07 06:07:40.897481+00	Male	0306068377	30
210	Jhon Lloyd	Panagel	Velancio		109481190081	2025-11-07 06:12:24.326332+00	Male	0297334825	30
214	Shaiera Mei	L.	Bedia		109481190192	2025-11-07 06:19:11.98735+00	Female	0297364553	30
215	Ivy Nicole	Dulog	Gayola		109481190017	2025-11-07 06:19:33.21191+00	Female	0306079497	30
216	Hannah Khazeia	Garcia	Jimenez		109481190158	2025-11-07 06:20:56.540019+00	Female	0297385625	30
217	Jhoanna May	D.	Capispisan		109481190223	2025-11-07 06:20:58.145717+00	Female	0306373689	30
218	Kethlyn	Enerez	Manigos		109481190045	2025-11-07 06:22:48.108251+00	Female	0294940121	30
221	Llyod Jhezrel	C.	Cordis		109481220090	2025-11-07 06:30:12.979674+00	Male	0308566713	13
222	Artelli Calmon	N.	Rabina		109481220178	2025-11-07 06:30:37.965588+00	Female	0309864537	13
223	Justin	L.	Gitalado		500239210016	2025-11-07 06:31:01.627304+00	Male	0305499433	13
224	Bernadette		Astrero		109481220237	2025-11-07 06:31:32.397764+00	Female	0296896249	13
225	Issiaah Zeus		Hersalia		109481220156	2025-11-07 06:32:31.653373+00	Male	0293000713	13
226	Jaymee Teagan		Valera		109481220228	2025-11-07 06:32:37.169995+00	Female	0309725945	13
227	Zildjan Andersen	P.	Ceballos		109481220231	2025-11-07 06:33:55.03339+00	Male	0308352153	13
228	Reign Channel	Diaz	Apostol		108291220057	2025-11-07 06:34:05.811848+00	Female	0309377641	13
229	John Seven	F.	Nuñez		10948122044	2025-11-07 06:34:59.059984+00	Male	0305588489	13
230	Miel Daniella	B.	Quiñones		109481220164	2025-11-07 06:35:33.31549+00	Female	0307414297	13
231	John Angelo	J.	Fuensalida		109481220125	2025-11-07 06:35:54.774009+00	Male	0308018329	13
233	Ken Iverson	L.	De Lara		109481220071	2025-11-07 06:36:31.901405+00	Male	0308301369	13
234	Kendra Gwenaelle	C.	Cauilan		109481220067	2025-11-07 06:36:36.268774+00	Female	0306944297	13
235	Denzheel Neil	S.	Laurel		109485220092	2025-11-07 06:37:17.437826+00	Male	0308578201	13
236	Amarah Zia	R.	Villatema		109481220083	2025-11-07 06:37:28.789068+00	Female	0298922889	13
237	Destiny Faith	D.	Ducta		109481220173	2025-11-07 06:38:30.576371+00	Female	0299159369	13
238	Sean Aldrei	C.	Flores		420509220016	2025-11-07 06:38:32.062958+00	Male	0308506473	13
239	Kyle Nicole		De Guzman		109481220068	2025-11-07 06:39:21.845115+00	Female	0291865289	13
240	John Lucas	B.	Corpuz		109481220188	2025-11-07 06:39:25.777871+00	Male	0308507801	13
241	Prince Yhuan	C.	Rivera		109481220213	2025-11-07 06:40:10.626692+00	Male	0299046841	13
242	Rehanna	A.	Borja		482823220014	2025-11-07 06:40:37.849045+00	Female	0293022537	13
243	Marcleo	P.	Janohan		109481220059	2025-11-07 06:40:54.011274+00	Male	0293081065	13
244	Anyca	E.	Abrensoza		109481220047	2025-11-07 06:41:33.226735+00	Female	0305727129	13
245	John Brix	S.	Sanglay		109481220246	2025-11-07 06:41:36.643797+00	Male	0299296473	13
248	Ruby Faith	J.	Alarco		109481220138	2025-11-07 06:43:20.951554+00	Female	0299315913	13
249	Vin'z Ezekiel	D.	De Chavez		109481220070	2025-11-07 06:43:25.489436+00	Male	0310240825	13
250	Avie Jhaye	R.	Javier		109481220074	2025-11-07 06:44:26.256134+00	Male	0310215897	13
255	Martinah Lhien	Mangandi	Aquino		408937220092	2025-11-07 06:49:27.395516+00	Female	0309375833	13
257	Jan Alliyah	S.	Dayao		109481200032	2025-11-07 06:51:33.769531+00	Female	0293050969	25
259	Ghuia Ellise	Q.	Tañon		109481200130	2025-11-07 06:52:22.2464+00	Female	0309630361	25
268	Hanzel Heather	C.	Angeles		109481240138	2025-11-07 07:04:30.709058+00	Male	0298117273	3
266	Zack Harvey	G.	San Juan	\N	109481240065	2025-11-07 07:03:05.266424+00	Male	0297543305	3
270	Prince Xion	A.	Inducil		109481240014	2025-11-07 07:06:06.188386+00	Male	0306985785	3
273	Zach Tyler	V.	Legal		409594240005	2025-11-07 07:07:41.219981+00	Male	0305586697	3
275	Jake Dylan		Julian		109481240165	2025-11-07 07:08:47.656752+00	Male	0305382537	3
43	Erish	G.	Del Rosario		109481240048	2025-11-03 05:45:58.018025+00	Female	0297377865	3
45	Chaella Savannah	S.	Rio		109481240132	2025-11-03 05:49:46.278719+00	Female	0299103609	3
46	Millard	G.	Soraino	Iii	109481240016	2025-11-03 05:51:35.538742+00	Male	0296806985	3
47	Legion	J.	Dela Cruz		403104240008	2025-11-03 05:53:05.041433+00	Male	0292308905	3
151	August	R.	Mantala		109481190190	2025-11-07 04:00:01.547576+00	Male	0306301449	30
29	Princess Gylle	P.	Nam-Ay		109481200081	2025-11-03 03:40:53.857056+00	Female	0296846777	25
30	Alliyah Audrei	U.	Articulo		109481200031	2025-11-03 03:42:11.026698+00	Female	0308127897	25
31	Dylan	C.	Rivera		109481200206	2025-11-03 03:43:10.308941+00	Male	0308559609	25
32	Sheikha Anushka	C.	Alag	\N	109481200068	2025-11-03 03:44:12.661536+00	Female	0308181369	25
81	Genesis Isaac		Liboon		109481200013	2025-11-07 03:23:39.092294+00	Male	0306046265	25
83	Mariel	R.	Diocton		109481200227	2025-11-07 03:25:23.034981+00	Female	0306026953	25
86	Jamir Martin	C.	Duazo	\N	408011190011	2025-11-07 03:26:20.249387+00	Male	0305675017	25
341	John		Grafe		104922090113	2025-11-08 17:41:23.351294+00	Male	\N	8
342	Test		Test		109481112	2025-11-08 18:10:30.574446+00	Female	\N	7
277	Damein Ally	R.	Debuque		109481240037	2025-11-07 07:10:00.11072+00	Male	0305692953	3
283	Ariane Joysz	B.	Calica		109481240082	2025-11-07 07:13:43.928639+00	Female	0310416377	3
286	Lianne Stephanie	C.	Pineda		109481240176	2025-11-07 07:14:53.748988+00	Female	0305378185	3
287	Athea Lynn	C.	Beunaventura		109481240043	2025-11-07 07:15:58.771115+00	Female	0300924777	3
264	Vincent	D.	Basco	\N	109481230127	2025-11-07 06:59:53.558166+00	Male	0310317833	7
289	Sandra Nicole	P.	Abella		403106220073	2025-11-07 07:17:24.931423+00	Female	0292914633	3
265	Carl Jacob	J.	Dalmacio	\N	109481230129	2025-11-07 07:02:39.738127+00	Male	0298914601	7
267	Zakydo Vein	R.	Duero	\N	109481230031	2025-11-07 07:03:23.532492+00	Male	0307453785	7
269	Mathew	B.	Eborde	\N	109481230034	2025-11-07 07:04:45.159657+00	Male	0310538233	7
288	Prince Arnel	R.	Rabino	\N	111580230074	2025-11-07 07:16:30.668943+00	Male	0309669353	7
271	Tristhan	G.	Evangelista	\N	109481230131	2025-11-07 07:06:36.517668+00	Male	0291989161	7
272	Jasper	M.	Garcelazo	\N	109481230132	2025-11-07 07:07:26.766403+00	Male	0297513481	7
274	John Carlo	A.	Garcia	\N	106937230029	2025-11-07 07:08:25.85523+00	Male	0306896185	7
276	Esmael	C.	Janaban	\N	109481230014	2025-11-07 07:09:15.488778+00	Male	0306840841	7
291	Hope Maeve	Sd.	Valiente		109481240180	2025-11-07 07:18:41.412755+00	Female	0299308185	3
280	Hayward Gabryl	P.	Malit	\N	109481230051	2025-11-07 07:10:13.05391+00	Male	0306963881	7
281	Tyler Ace	C.	Mañacap	\N	109481230209	2025-11-07 07:11:24.310708+00	Male	0298263449	7
282	Nikola Arthur	C.	Martinovic	\N	403097230005	2025-11-07 07:12:25.230004+00	Male	0292040825	7
285	Janjay Lenmar	T.	Molina	\N	100216230004	2025-11-07 07:14:06.900844+00	Male	0298854409	7
292	Jake Lorence	C.	Tañamor		109481230020	2025-11-07 07:20:51.127813+00	Male	0291892841	7
293	Janna	Celestino	Vargas		109481240133	2025-11-07 07:21:25.871284+00	Female	0299130425	3
294	Jane Andrea	R.	Bandales		109481230220	2025-11-07 07:21:49.299444+00	Female	0299212713	7
295	Althea Nicole	A.	Bondad		109481230155	2025-11-07 07:23:04.504945+00	Female	0310503321	7
296	Abby	Sanzol	Ocampo		109496240186	2025-11-07 07:24:03.924306+00	Female	0305697017	3
297	Isiah Gwyneth	S.	Claveria		109481230145	2025-11-07 07:24:06.519224+00	Female	0291811897	7
298	Georjette Aziya	S.	Concepcion		109481230188	2025-11-07 07:25:35.796288+00	Female	0293063081	7
299	Hexel Marigold	F.	Goyal		109481240050	2025-11-07 07:26:29.249254+00	Female	0293119129	3
301	Letizia Kae	E.	Dalisay		109481230222	2025-11-07 07:27:14.77623+00	Female	0117165145	7
302	Judie	T.	Celetaria		109481240072	2025-11-07 07:27:44.833756+00	Female	0300983209	3
303	Rhea May	H.	Garbin		109481230109	2025-11-07 07:28:15.685434+00	Female	0117294505	7
304	Catrina	A.	Rabino		109481240068	2025-11-07 07:28:37.897748+00	Female	0117175945	3
305	Eloisa Claire	A.	Gonzales		170008230011	2025-11-07 07:29:13.710285+00	Female	0291962457	7
306	Reissha Mae	P.	Puerta		409594230003	2025-11-07 07:30:21.208863+00	Female	0291679289	7
307	Janine	B.	Rivero		109481240157	2025-11-07 07:30:34.901334+00	Female	0310126089	3
308	Samantha	Z.	Samson		109481230066	2025-11-07 07:31:00.037275+00	Female	0309621417	7
309	Akierha	Uy	Setillas		109481230114	2025-11-07 07:32:08.869261+00	Female	0306175161	7
310	Jianna Denise	F.	Clemente		109481240134	2025-11-07 07:32:12.452146+00	Female	0292916473	3
311	Quinn Veronica	M.	Serial		109481230117	2025-11-07 07:32:58.183564+00	Female	0310429817	7
312	Johshellyn	P.	Bantillo		109481240118	2025-11-07 07:34:06.653748+00	Female	0310046601	3
313	Ayanna Ysabel	H.	Tamayo		109481240066	2025-11-07 07:35:30.087415+00	Female	0306057897	3
314	Arhiane	P.	Lawig		109481240175	2025-11-07 07:37:29.232171+00	Female	0294896521	3
315	Zydwrex Jhian	A.	Mendoza		109481240053	2025-11-07 07:37:56.968141+00	Male	0304192553	3
316	Jodel	M.	Rempis		109481240111	2025-11-07 07:39:30.857754+00	Male	0305765241	3
317	Kailer Jacob	G.	Jao		109481240098	2025-11-07 07:39:48.981397+00	Male	0306344873	3
318	John Mark	R.	Laurio		109481240041	2025-11-07 07:40:31.96381+00	Male	0294935401	3
319	Prince Xyrus	A.	Dacanay		109481240009	2025-11-07 07:41:35.364148+00	Male	0309266489	3
320	Cleo Niño	C.	Ocampo		109481240056	2025-11-07 07:42:28.741086+00	Male	0309210105	3
321	Kyle Zion	D.	Pacure		109481240031	2025-11-07 07:43:26.527146+00	Male	0294962649	3
322	Rap Mateo	O.	Villacorta		109481240181	2025-11-07 07:44:05.806635+00	Male	0299045273	3
323	Dashiell Jacob	R.	Lagamson		109481240099	2025-11-07 07:45:19.81621+00	Male	0292692057	3
263	Jaily Calix	Tipon	Pusta	\N	109487200461	2025-11-07 06:55:11.581062+00	Male	0299325577	25
324	Nicolo Zandrus	E.	Ortega		109481240030	2025-11-07 07:45:22.920477+00	Male	0308372953	3
326	Johnkyle		Bantasan		109481200238	2025-11-07 08:06:36.739174+00	Male	0298977673	25
328	Alden Rey	Rion	De Leon		109481200005	2025-11-07 08:09:31.812743+00	Male	0305403945	25
261	Kyle Liam	Cabalpin	Fernando	\N	111135200006	2025-11-07 06:53:33.260571+00	Male	0292293337	25
329	Gio Eleandre Valentino	Tagabi	Guito		109481200158	2025-11-07 08:12:41.42957+00	Male	0308085657	25
331	Amber Nicole	Sanita	Pateña		136682200067	2025-11-07 08:15:08.996315+00	Female	0308583001	25
332	Rhian Vernice	P.	Del Rosario		109481200074	2025-11-07 08:16:00.698482+00	Female	0308531865	25
333	Erica Mae	Calica	Peñaloza		109763200103	2025-11-07 08:17:15.782087+00	Female	0292687737	25
334	Aliyah Nicolete	Ayon	Saul		109481200064	2025-11-07 08:18:51.328713+00	Female	0292092393	25
258	John Rogie	M.	De Guzman	\N	109481200184	2025-11-07 06:51:56.959407+00	Male	0298351385	25
\.


--
-- TOC entry 4459 (class 0 OID 74562)
-- Dependencies: 391
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users" ("id", "student_id", "email", "password_hash", "is_active", "created_at", "updated_at", "last_login") FROM stdin;
\.


--
-- TOC entry 4467 (class 0 OID 100877)
-- Dependencies: 400
-- Data for Name: messages_2025_11_02; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_02" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4468 (class 0 OID 103129)
-- Dependencies: 401
-- Data for Name: messages_2025_11_03; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_03" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4469 (class 0 OID 103141)
-- Dependencies: 402
-- Data for Name: messages_2025_11_04; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_04" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4471 (class 0 OID 104290)
-- Dependencies: 404
-- Data for Name: messages_2025_11_05; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_05" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4472 (class 0 OID 105405)
-- Dependencies: 405
-- Data for Name: messages_2025_11_06; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_06" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4473 (class 0 OID 106527)
-- Dependencies: 406
-- Data for Name: messages_2025_11_07; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_07" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4475 (class 0 OID 107164)
-- Dependencies: 420
-- Data for Name: messages_2025_11_08; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_08" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4445 (class 0 OID 17554)
-- Dependencies: 376
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."schema_migrations" ("version", "inserted_at") FROM stdin;
20211116024918	2025-07-11 09:43:29
20211116045059	2025-07-11 09:43:29
20211116050929	2025-07-11 09:43:29
20211116051442	2025-07-11 09:43:29
20211116212300	2025-07-11 09:43:29
20211116213355	2025-07-11 09:43:29
20211116213934	2025-07-11 09:43:29
20211116214523	2025-07-11 09:43:29
20211122062447	2025-07-11 09:43:29
20211124070109	2025-07-11 09:43:29
20211202204204	2025-07-11 09:43:29
20211202204605	2025-07-11 09:43:29
20211210212804	2025-07-11 09:43:29
20211228014915	2025-07-11 09:43:29
20220107221237	2025-07-11 09:43:29
20220228202821	2025-07-11 09:43:29
20220312004840	2025-07-11 09:43:29
20220603231003	2025-07-11 09:43:29
20220603232444	2025-07-11 09:43:29
20220615214548	2025-07-11 09:43:29
20220712093339	2025-07-11 09:43:29
20220908172859	2025-07-11 09:43:29
20220916233421	2025-07-11 09:43:29
20230119133233	2025-07-11 09:43:29
20230128025114	2025-07-11 09:43:29
20230128025212	2025-07-11 09:43:29
20230227211149	2025-07-11 09:43:29
20230228184745	2025-07-11 09:43:30
20230308225145	2025-07-11 09:43:30
20230328144023	2025-07-11 09:43:30
20231018144023	2025-07-11 09:43:30
20231204144023	2025-07-11 09:43:30
20231204144024	2025-07-11 09:43:30
20231204144025	2025-07-11 09:43:30
20240108234812	2025-07-11 09:43:30
20240109165339	2025-07-11 09:43:30
20240227174441	2025-07-11 09:43:30
20240311171622	2025-07-11 09:43:30
20240321100241	2025-07-11 09:43:30
20240401105812	2025-07-11 09:43:30
20240418121054	2025-07-11 09:43:30
20240523004032	2025-07-11 09:43:30
20240618124746	2025-07-11 09:43:30
20240801235015	2025-07-11 09:43:30
20240805133720	2025-07-11 09:43:30
20240827160934	2025-07-11 09:43:30
20240919163303	2025-07-11 09:43:30
20240919163305	2025-07-11 09:43:30
20241019105805	2025-07-11 09:43:30
20241030150047	2025-07-11 09:43:30
20241108114728	2025-07-11 09:43:30
20241121104152	2025-07-11 09:43:30
20241130184212	2025-07-11 09:43:30
20241220035512	2025-07-11 09:43:30
20241220123912	2025-07-11 09:43:30
20241224161212	2025-07-11 09:43:30
20250107150512	2025-07-11 09:43:30
20250110162412	2025-07-11 09:43:30
20250123174212	2025-07-11 09:43:30
20250128220012	2025-07-11 09:43:30
20250506224012	2025-07-11 09:43:30
20250523164012	2025-07-11 09:43:30
20250714121412	2025-08-04 04:26:40
20250905041441	2025-10-03 13:45:13
\.


--
-- TOC entry 4446 (class 0 OID 17557)
-- Dependencies: 377
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."subscription" ("id", "subscription_id", "entity", "filters", "claims", "created_at") FROM stdin;
\.


--
-- TOC entry 4448 (class 0 OID 17566)
-- Dependencies: 379
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
\.


--
-- TOC entry 4457 (class 0 OID 73408)
-- Dependencies: 389
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets_analytics" ("id", "type", "format", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4449 (class 0 OID 17575)
-- Dependencies: 380
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."migrations" ("id", "name", "hash", "executed_at") FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-07-11 09:43:30.002462
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-07-11 09:43:30.006574
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-07-11 09:43:30.010035
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-07-11 09:43:30.023283
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-07-11 09:43:30.030508
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-07-11 09:43:30.03368
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-07-11 09:43:30.037256
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-07-11 09:43:30.04025
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-07-11 09:43:30.044108
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-07-11 09:43:30.04697
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-07-11 09:43:30.050498
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-07-11 09:43:30.053818
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-07-11 09:43:30.057446
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-07-11 09:43:30.060379
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-07-11 09:43:30.064751
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-07-11 09:43:30.080613
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-07-11 09:43:30.084397
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-07-11 09:43:30.087165
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-07-11 09:43:30.09039
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-07-11 09:43:30.094069
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-07-11 09:43:30.097238
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-07-11 09:43:30.103003
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-07-11 09:43:30.113058
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-07-11 09:43:30.121239
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-07-11 09:43:30.124484
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-07-11 09:43:30.128595
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-10-03 13:45:14.137549
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-10-03 13:45:14.215557
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-10-03 13:45:14.224084
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-10-03 13:45:14.234584
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-10-03 13:45:14.241906
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-10-03 13:45:14.246458
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-10-03 13:45:14.250899
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-10-03 13:45:14.255201
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-10-03 13:45:14.256651
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-10-03 13:45:14.262786
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-10-03 13:45:14.267344
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-10-03 13:45:14.288225
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-10-03 13:45:14.293021
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-10-03 13:45:14.313304
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-10-03 13:45:14.32001
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-10-03 13:45:14.32781
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-10-03 13:45:14.333577
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-10-03 13:45:14.339469
\.


--
-- TOC entry 4450 (class 0 OID 17579)
-- Dependencies: 381
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") FROM stdin;
\.


--
-- TOC entry 4456 (class 0 OID 73363)
-- Dependencies: 388
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4451 (class 0 OID 17589)
-- Dependencies: 382
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- TOC entry 4452 (class 0 OID 17596)
-- Dependencies: 383
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- TOC entry 3824 (class 0 OID 17277)
-- Dependencies: 349
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4559 (class 0 OID 0)
-- Dependencies: 363
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- TOC entry 4560 (class 0 OID 0)
-- Dependencies: 408
-- Name: jobid_seq; Type: SEQUENCE SET; Schema: cron; Owner: -
--

SELECT pg_catalog.setval('"cron"."jobid_seq"', 4, true);


--
-- TOC entry 4561 (class 0 OID 0)
-- Dependencies: 410
-- Name: runid_seq; Type: SEQUENCE SET; Schema: cron; Owner: -
--

SELECT pg_catalog.setval('"cron"."runid_seq"', 4, true);


--
-- TOC entry 4562 (class 0 OID 0)
-- Dependencies: 372
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."admin_users_id_seq"', 64, true);


--
-- TOC entry 4563 (class 0 OID 0)
-- Dependencies: 398
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."announcements_id_seq"', 17, true);


--
-- TOC entry 4564 (class 0 OID 0)
-- Dependencies: 396
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."attendance_id_seq"', 1, false);


--
-- TOC entry 4565 (class 0 OID 0)
-- Dependencies: 421
-- Name: grade_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."grade_sections_id_seq"', 30, true);


--
-- TOC entry 4566 (class 0 OID 0)
-- Dependencies: 374
-- Name: login_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."login_logs_id_seq"', 852, true);


--
-- TOC entry 4567 (class 0 OID 0)
-- Dependencies: 385
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."students_id_seq"', 342, true);


--
-- TOC entry 4568 (class 0 OID 0)
-- Dependencies: 390
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_id_seq"', 9, true);


--
-- TOC entry 4569 (class 0 OID 0)
-- Dependencies: 378
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('"realtime"."subscription_id_seq"', 637, true);


--
-- TOC entry 3996 (class 2606 OID 17610)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "amr_id_pk" PRIMARY KEY ("id");


--
-- TOC entry 3980 (class 2606 OID 17612)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."audit_log_entries"
    ADD CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3984 (class 2606 OID 17614)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."flow_state"
    ADD CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3989 (class 2606 OID 17616)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3991 (class 2606 OID 17618)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_provider_id_provider_unique" UNIQUE ("provider_id", "provider");


--
-- TOC entry 3994 (class 2606 OID 17620)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3998 (class 2606 OID 17622)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE ("session_id", "authentication_method");


--
-- TOC entry 4001 (class 2606 OID 17624)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4004 (class 2606 OID 17626)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE ("last_challenged_at");


--
-- TOC entry 4006 (class 2606 OID 17628)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4121 (class 2606 OID 85780)
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_code_key" UNIQUE ("authorization_code");


--
-- TOC entry 4123 (class 2606 OID 85778)
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_id_key" UNIQUE ("authorization_id");


--
-- TOC entry 4125 (class 2606 OID 85776)
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4104 (class 2606 OID 33514)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_clients"
    ADD CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4129 (class 2606 OID 85802)
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4131 (class 2606 OID 85804)
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_client_unique" UNIQUE ("user_id", "client_id");


--
-- TOC entry 4011 (class 2606 OID 17630)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4019 (class 2606 OID 17632)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4022 (class 2606 OID 17634)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token");


--
-- TOC entry 4025 (class 2606 OID 17636)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id");


--
-- TOC entry 4027 (class 2606 OID 17638)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4032 (class 2606 OID 17640)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4035 (class 2606 OID 17642)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- TOC entry 4039 (class 2606 OID 17644)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4044 (class 2606 OID 17646)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4047 (class 2606 OID 17648)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_providers"
    ADD CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4060 (class 2606 OID 17650)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");


--
-- TOC entry 4062 (class 2606 OID 17652)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4064 (class 2606 OID 17654)
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4066 (class 2606 OID 17656)
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_username_key" UNIQUE ("username");


--
-- TOC entry 4143 (class 2606 OID 93021)
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4139 (class 2606 OID 90491)
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4141 (class 2606 OID 90493)
-- Name: attendance attendance_student_id_attendance_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_student_id_attendance_date_key" UNIQUE ("student_id", "attendance_date");


--
-- TOC entry 4168 (class 2606 OID 106552)
-- Name: auto_timeout_logs auto_timeout_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auto_timeout_logs"
    ADD CONSTRAINT "auto_timeout_logs_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4155 (class 2606 OID 104267)
-- Name: email_verifications email_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."email_verifications"
    ADD CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("email");


--
-- TOC entry 4181 (class 2606 OID 107186)
-- Name: grade_sections grade_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."grade_sections"
    ADD CONSTRAINT "grade_sections_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4183 (class 2606 OID 107188)
-- Name: grade_sections grade_sections_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."grade_sections"
    ADD CONSTRAINT "grade_sections_unique" UNIQUE ("grade_level", "section_name");


--
-- TOC entry 4068 (class 2606 OID 17662)
-- Name: login_logs login_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."login_logs"
    ADD CONSTRAINT "login_logs_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4137 (class 2606 OID 90311)
-- Name: rfid_logs rfid_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."rfid_logs"
    ADD CONSTRAINT "rfid_logs_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4099 (class 2606 OID 20161)
-- Name: students students_lrn_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_lrn_key" UNIQUE ("lrn");


--
-- TOC entry 4101 (class 2606 OID 17922)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4114 (class 2606 OID 74575)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");


--
-- TOC entry 4116 (class 2606 OID 74571)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4118 (class 2606 OID 74573)
-- Name: users users_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_student_id_key" UNIQUE ("student_id");


--
-- TOC entry 4071 (class 2606 OID 17668)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4147 (class 2606 OID 100885)
-- Name: messages_2025_11_02 messages_2025_11_02_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_02"
    ADD CONSTRAINT "messages_2025_11_02_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4150 (class 2606 OID 103137)
-- Name: messages_2025_11_03 messages_2025_11_03_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_03"
    ADD CONSTRAINT "messages_2025_11_03_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4153 (class 2606 OID 103149)
-- Name: messages_2025_11_04 messages_2025_11_04_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_04"
    ADD CONSTRAINT "messages_2025_11_04_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4160 (class 2606 OID 104298)
-- Name: messages_2025_11_05 messages_2025_11_05_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_05"
    ADD CONSTRAINT "messages_2025_11_05_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4163 (class 2606 OID 105413)
-- Name: messages_2025_11_06 messages_2025_11_06_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_06"
    ADD CONSTRAINT "messages_2025_11_06_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4166 (class 2606 OID 106535)
-- Name: messages_2025_11_07 messages_2025_11_07_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_07"
    ADD CONSTRAINT "messages_2025_11_07_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4179 (class 2606 OID 107172)
-- Name: messages_2025_11_08 messages_2025_11_08_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_08"
    ADD CONSTRAINT "messages_2025_11_08_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4076 (class 2606 OID 17670)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."subscription"
    ADD CONSTRAINT "pk_subscription" PRIMARY KEY ("id");


--
-- TOC entry 4073 (class 2606 OID 17672)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- TOC entry 4109 (class 2606 OID 73418)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets_analytics"
    ADD CONSTRAINT "buckets_analytics_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4080 (class 2606 OID 17674)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets"
    ADD CONSTRAINT "buckets_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4082 (class 2606 OID 17676)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_name_key" UNIQUE ("name");


--
-- TOC entry 4084 (class 2606 OID 17678)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4092 (class 2606 OID 17680)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4107 (class 2606 OID 73372)
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_pkey" PRIMARY KEY ("bucket_id", "level", "name");


--
-- TOC entry 4097 (class 2606 OID 17682)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4095 (class 2606 OID 17684)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3981 (class 1259 OID 17685)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" USING "btree" ("instance_id");


--
-- TOC entry 4050 (class 1259 OID 17686)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" USING "btree" ("confirmation_token") WHERE (("confirmation_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 4051 (class 1259 OID 17687)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" USING "btree" ("email_change_token_current") WHERE (("email_change_token_current")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 4052 (class 1259 OID 17688)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" USING "btree" ("email_change_token_new") WHERE (("email_change_token_new")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 4002 (class 1259 OID 17689)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" USING "btree" ("user_id", "created_at");


--
-- TOC entry 3982 (class 1259 OID 17690)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" USING "btree" ("created_at" DESC);


--
-- TOC entry 3987 (class 1259 OID 17691)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_email_idx" ON "auth"."identities" USING "btree" ("email" "text_pattern_ops");


--
-- TOC entry 4570 (class 0 OID 0)
-- Dependencies: 3987
-- Name: INDEX "identities_email_idx"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."identities_email_idx" IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 3992 (class 1259 OID 17692)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_user_id_idx" ON "auth"."identities" USING "btree" ("user_id");


--
-- TOC entry 3985 (class 1259 OID 17693)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_auth_code" ON "auth"."flow_state" USING "btree" ("auth_code");


--
-- TOC entry 3986 (class 1259 OID 17694)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" USING "btree" ("user_id", "authentication_method");


--
-- TOC entry 3999 (class 1259 OID 17695)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" USING "btree" ("created_at" DESC);


--
-- TOC entry 4007 (class 1259 OID 17696)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" USING "btree" ("friendly_name", "user_id") WHERE (TRIM(BOTH FROM "friendly_name") <> ''::"text");


--
-- TOC entry 4008 (class 1259 OID 17697)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" USING "btree" ("user_id");


--
-- TOC entry 4119 (class 1259 OID 85791)
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_auth_pending_exp_idx" ON "auth"."oauth_authorizations" USING "btree" ("expires_at") WHERE ("status" = 'pending'::"auth"."oauth_authorization_status");


--
-- TOC entry 4102 (class 1259 OID 33518)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_clients_deleted_at_idx" ON "auth"."oauth_clients" USING "btree" ("deleted_at");


--
-- TOC entry 4126 (class 1259 OID 85817)
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_active_client_idx" ON "auth"."oauth_consents" USING "btree" ("client_id") WHERE ("revoked_at" IS NULL);


--
-- TOC entry 4127 (class 1259 OID 85815)
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_active_user_client_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "client_id") WHERE ("revoked_at" IS NULL);


--
-- TOC entry 4132 (class 1259 OID 85816)
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_user_order_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "granted_at" DESC);


--
-- TOC entry 4012 (class 1259 OID 17698)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("relates_to");


--
-- TOC entry 4013 (class 1259 OID 17699)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("token_hash");


--
-- TOC entry 4014 (class 1259 OID 17700)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" USING "btree" ("user_id", "token_type");


--
-- TOC entry 4053 (class 1259 OID 17701)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" USING "btree" ("reauthentication_token") WHERE (("reauthentication_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 4054 (class 1259 OID 17702)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" USING "btree" ("recovery_token") WHERE (("recovery_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 4015 (class 1259 OID 17703)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id");


--
-- TOC entry 4016 (class 1259 OID 17704)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id", "user_id");


--
-- TOC entry 4017 (class 1259 OID 17705)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" USING "btree" ("parent");


--
-- TOC entry 4020 (class 1259 OID 17706)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" USING "btree" ("session_id", "revoked");


--
-- TOC entry 4023 (class 1259 OID 17707)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" USING "btree" ("updated_at" DESC);


--
-- TOC entry 4028 (class 1259 OID 17708)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" USING "btree" ("sso_provider_id");


--
-- TOC entry 4029 (class 1259 OID 17709)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" USING "btree" ("created_at" DESC);


--
-- TOC entry 4030 (class 1259 OID 17710)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" USING "btree" ("for_email");


--
-- TOC entry 4033 (class 1259 OID 17711)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" USING "btree" ("sso_provider_id");


--
-- TOC entry 4036 (class 1259 OID 17712)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" USING "btree" ("not_after" DESC);


--
-- TOC entry 4037 (class 1259 OID 85829)
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_oauth_client_id_idx" ON "auth"."sessions" USING "btree" ("oauth_client_id");


--
-- TOC entry 4040 (class 1259 OID 17713)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" USING "btree" ("user_id");


--
-- TOC entry 4042 (class 1259 OID 17714)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" USING "btree" ("lower"("domain"));


--
-- TOC entry 4045 (class 1259 OID 17715)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" USING "btree" ("sso_provider_id");


--
-- TOC entry 4048 (class 1259 OID 17716)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" USING "btree" ("lower"("resource_id"));


--
-- TOC entry 4049 (class 1259 OID 33496)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sso_providers_resource_id_pattern_idx" ON "auth"."sso_providers" USING "btree" ("resource_id" "text_pattern_ops");


--
-- TOC entry 4009 (class 1259 OID 17717)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" USING "btree" ("user_id", "phone");


--
-- TOC entry 4041 (class 1259 OID 17718)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" USING "btree" ("user_id", "created_at");


--
-- TOC entry 4055 (class 1259 OID 17719)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" USING "btree" ("email") WHERE ("is_sso_user" = false);


--
-- TOC entry 4571 (class 0 OID 0)
-- Dependencies: 4055
-- Name: INDEX "users_email_partial_key"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."users_email_partial_key" IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 4056 (class 1259 OID 17720)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING "btree" ("instance_id", "lower"(("email")::"text"));


--
-- TOC entry 4057 (class 1259 OID 17721)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING "btree" ("instance_id");


--
-- TOC entry 4058 (class 1259 OID 17722)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" USING "btree" ("is_anonymous");


--
-- TOC entry 4144 (class 1259 OID 93022)
-- Name: idx_announcements_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_announcements_created_at" ON "public"."announcements" USING "btree" ("created_at" DESC);


--
-- TOC entry 4169 (class 1259 OID 106554)
-- Name: idx_auto_timeout_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_auto_timeout_logs_created_at" ON "public"."auto_timeout_logs" USING "btree" ("created_at" DESC);


--
-- TOC entry 4170 (class 1259 OID 106553)
-- Name: idx_auto_timeout_logs_rfid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_auto_timeout_logs_rfid" ON "public"."auto_timeout_logs" USING "btree" ("rfid");


--
-- TOC entry 4156 (class 1259 OID 104268)
-- Name: idx_email_verifications_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_email_verifications_email" ON "public"."email_verifications" USING "btree" ("email");


--
-- TOC entry 4157 (class 1259 OID 104269)
-- Name: idx_email_verifications_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_email_verifications_expires_at" ON "public"."email_verifications" USING "btree" ("expires_at");


--
-- TOC entry 4133 (class 1259 OID 90312)
-- Name: idx_rfid_logs_rfid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_rfid_logs_rfid" ON "public"."rfid_logs" USING "btree" ("rfid");


--
-- TOC entry 4134 (class 1259 OID 90314)
-- Name: idx_rfid_logs_tap_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_rfid_logs_tap_count" ON "public"."rfid_logs" USING "btree" ("tap_count");


--
-- TOC entry 4135 (class 1259 OID 90313)
-- Name: idx_rfid_logs_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_rfid_logs_timestamp" ON "public"."rfid_logs" USING "btree" ("timestamp" DESC);


--
-- TOC entry 4110 (class 1259 OID 74582)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_users_email" ON "public"."users" USING "btree" ("email");


--
-- TOC entry 4111 (class 1259 OID 74583)
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_users_is_active" ON "public"."users" USING "btree" ("is_active");


--
-- TOC entry 4112 (class 1259 OID 74581)
-- Name: idx_users_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_users_student_id" ON "public"."users" USING "btree" ("student_id");


--
-- TOC entry 4074 (class 1259 OID 17723)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "ix_realtime_subscription_entity" ON "realtime"."subscription" USING "btree" ("entity");


--
-- TOC entry 4069 (class 1259 OID 73361)
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_inserted_at_topic_index" ON ONLY "realtime"."messages" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4145 (class 1259 OID 100886)
-- Name: messages_2025_11_02_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_02_inserted_at_topic_idx" ON "realtime"."messages_2025_11_02" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4148 (class 1259 OID 103138)
-- Name: messages_2025_11_03_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_03_inserted_at_topic_idx" ON "realtime"."messages_2025_11_03" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4151 (class 1259 OID 103150)
-- Name: messages_2025_11_04_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_04_inserted_at_topic_idx" ON "realtime"."messages_2025_11_04" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4158 (class 1259 OID 104299)
-- Name: messages_2025_11_05_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_05_inserted_at_topic_idx" ON "realtime"."messages_2025_11_05" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4161 (class 1259 OID 105414)
-- Name: messages_2025_11_06_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_06_inserted_at_topic_idx" ON "realtime"."messages_2025_11_06" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4164 (class 1259 OID 106536)
-- Name: messages_2025_11_07_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_07_inserted_at_topic_idx" ON "realtime"."messages_2025_11_07" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4177 (class 1259 OID 107173)
-- Name: messages_2025_11_08_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_08_inserted_at_topic_idx" ON "realtime"."messages_2025_11_08" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4077 (class 1259 OID 17724)
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX "subscription_subscription_id_entity_filters_key" ON "realtime"."subscription" USING "btree" ("subscription_id", "entity", "filters");


--
-- TOC entry 4078 (class 1259 OID 17725)
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING "btree" ("name");


--
-- TOC entry 4085 (class 1259 OID 17726)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING "btree" ("bucket_id", "name");


--
-- TOC entry 4093 (class 1259 OID 17727)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" USING "btree" ("bucket_id", "key", "created_at");


--
-- TOC entry 4086 (class 1259 OID 73390)
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "idx_name_bucket_level_unique" ON "storage"."objects" USING "btree" ("name" COLLATE "C", "bucket_id", "level");


--
-- TOC entry 4087 (class 1259 OID 17728)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" USING "btree" ("bucket_id", "name" COLLATE "C");


--
-- TOC entry 4088 (class 1259 OID 73392)
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_objects_lower_name" ON "storage"."objects" USING "btree" (("path_tokens"["level"]), "lower"("name") "text_pattern_ops", "bucket_id", "level");


--
-- TOC entry 4105 (class 1259 OID 73393)
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_prefixes_lower_name" ON "storage"."prefixes" USING "btree" ("bucket_id", "level", (("string_to_array"("name", '/'::"text"))["level"]), "lower"("name") "text_pattern_ops");


--
-- TOC entry 4089 (class 1259 OID 17729)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "name_prefix_search" ON "storage"."objects" USING "btree" ("name" "text_pattern_ops");


--
-- TOC entry 4090 (class 1259 OID 73391)
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "objects_bucket_id_level_idx" ON "storage"."objects" USING "btree" ("bucket_id", "level", "name" COLLATE "C");


--
-- TOC entry 4184 (class 0 OID 0)
-- Name: messages_2025_11_02_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_02_inserted_at_topic_idx";


--
-- TOC entry 4185 (class 0 OID 0)
-- Name: messages_2025_11_02_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_02_pkey";


--
-- TOC entry 4186 (class 0 OID 0)
-- Name: messages_2025_11_03_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_03_inserted_at_topic_idx";


--
-- TOC entry 4187 (class 0 OID 0)
-- Name: messages_2025_11_03_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_03_pkey";


--
-- TOC entry 4188 (class 0 OID 0)
-- Name: messages_2025_11_04_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_04_inserted_at_topic_idx";


--
-- TOC entry 4189 (class 0 OID 0)
-- Name: messages_2025_11_04_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_04_pkey";


--
-- TOC entry 4190 (class 0 OID 0)
-- Name: messages_2025_11_05_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_05_inserted_at_topic_idx";


--
-- TOC entry 4191 (class 0 OID 0)
-- Name: messages_2025_11_05_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_05_pkey";


--
-- TOC entry 4192 (class 0 OID 0)
-- Name: messages_2025_11_06_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_06_inserted_at_topic_idx";


--
-- TOC entry 4193 (class 0 OID 0)
-- Name: messages_2025_11_06_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_06_pkey";


--
-- TOC entry 4194 (class 0 OID 0)
-- Name: messages_2025_11_07_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_07_inserted_at_topic_idx";


--
-- TOC entry 4195 (class 0 OID 0)
-- Name: messages_2025_11_07_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_07_pkey";


--
-- TOC entry 4196 (class 0 OID 0)
-- Name: messages_2025_11_08_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_08_inserted_at_topic_idx";


--
-- TOC entry 4197 (class 0 OID 0)
-- Name: messages_2025_11_08_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_08_pkey";


--
-- TOC entry 4232 (class 2620 OID 74590)
-- Name: users trigger_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "trigger_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_users_updated_at"();


--
-- TOC entry 4224 (class 2620 OID 17730)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER "tr_check_filters" BEFORE INSERT OR UPDATE ON "realtime"."subscription" FOR EACH ROW EXECUTE FUNCTION "realtime"."subscription_check_filters"();


--
-- TOC entry 4225 (class 2620 OID 73400)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "enforce_bucket_name_length_trigger" BEFORE INSERT OR UPDATE OF "name" ON "storage"."buckets" FOR EACH ROW EXECUTE FUNCTION "storage"."enforce_bucket_name_length"();


--
-- TOC entry 4226 (class 2620 OID 73431)
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_delete_delete_prefix" AFTER DELETE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- TOC entry 4227 (class 2620 OID 73386)
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_insert_create_prefix" BEFORE INSERT ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."objects_insert_prefix_trigger"();


--
-- TOC entry 4228 (class 2620 OID 73430)
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_update_create_prefix" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW WHEN ((("new"."name" <> "old"."name") OR ("new"."bucket_id" <> "old"."bucket_id"))) EXECUTE FUNCTION "storage"."objects_update_prefix_trigger"();


--
-- TOC entry 4230 (class 2620 OID 73396)
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "prefixes_create_hierarchy" BEFORE INSERT ON "storage"."prefixes" FOR EACH ROW WHEN (("pg_trigger_depth"() < 1)) EXECUTE FUNCTION "storage"."prefixes_insert_trigger"();


--
-- TOC entry 4231 (class 2620 OID 73432)
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "prefixes_delete_hierarchy" AFTER DELETE ON "storage"."prefixes" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- TOC entry 4229 (class 2620 OID 17731)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- TOC entry 4198 (class 2606 OID 17732)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4199 (class 2606 OID 17737)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- TOC entry 4200 (class 2606 OID 17742)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE;


--
-- TOC entry 4201 (class 2606 OID 17747)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4218 (class 2606 OID 85781)
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- TOC entry 4219 (class 2606 OID 85786)
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4220 (class 2606 OID 85810)
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- TOC entry 4221 (class 2606 OID 85805)
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4202 (class 2606 OID 17752)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4203 (class 2606 OID 17757)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- TOC entry 4204 (class 2606 OID 17762)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- TOC entry 4205 (class 2606 OID 17767)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE;


--
-- TOC entry 4206 (class 2606 OID 17772)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- TOC entry 4207 (class 2606 OID 85824)
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_oauth_client_id_fkey" FOREIGN KEY ("oauth_client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- TOC entry 4208 (class 2606 OID 17777)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4209 (class 2606 OID 17782)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- TOC entry 4222 (class 2606 OID 90499)
-- Name: attendance attendance_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "public"."admin_users"("id");


--
-- TOC entry 4223 (class 2606 OID 90494)
-- Name: attendance attendance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id");


--
-- TOC entry 4215 (class 2606 OID 107312)
-- Name: students fk_students_grade_section; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "fk_students_grade_section" FOREIGN KEY ("grade_section_id") REFERENCES "public"."grade_sections"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4217 (class 2606 OID 74576)
-- Name: users fk_users_student_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "fk_users_student_id" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4210 (class 2606 OID 17797)
-- Name: login_logs login_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."login_logs"
    ADD CONSTRAINT "login_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id");


--
-- TOC entry 4211 (class 2606 OID 17802)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4216 (class 2606 OID 73373)
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4212 (class 2606 OID 17807)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4213 (class 2606 OID 17812)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4214 (class 2606 OID 17817)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE CASCADE;


--
-- TOC entry 4383 (class 0 OID 17420)
-- Dependencies: 354
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4384 (class 0 OID 17426)
-- Dependencies: 355
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4385 (class 0 OID 17431)
-- Dependencies: 356
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4386 (class 0 OID 17438)
-- Dependencies: 357
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4387 (class 0 OID 17443)
-- Dependencies: 358
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4388 (class 0 OID 17448)
-- Dependencies: 359
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4389 (class 0 OID 17453)
-- Dependencies: 360
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4390 (class 0 OID 17458)
-- Dependencies: 361
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4391 (class 0 OID 17466)
-- Dependencies: 362
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4392 (class 0 OID 17472)
-- Dependencies: 364
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4393 (class 0 OID 17480)
-- Dependencies: 365
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4394 (class 0 OID 17486)
-- Dependencies: 366
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4395 (class 0 OID 17489)
-- Dependencies: 367
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4396 (class 0 OID 17494)
-- Dependencies: 368
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4397 (class 0 OID 17500)
-- Dependencies: 369
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4398 (class 0 OID 17506)
-- Dependencies: 370
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4417 (class 3256 OID 106555)
-- Name: auto_timeout_logs Allow all operations on auto_timeout_logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all operations on auto_timeout_logs" ON "public"."auto_timeout_logs" USING (true) WITH CHECK (true);


--
-- TOC entry 4416 (class 3256 OID 90315)
-- Name: rfid_logs Allow all operations on rfid_logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all operations on rfid_logs" ON "public"."rfid_logs" USING (true) WITH CHECK (true);


--
-- TOC entry 4414 (class 3256 OID 74627)
-- Name: users Allow anonymous insert to users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous insert to users" ON "public"."users" FOR INSERT TO "anon" WITH CHECK (true);


--
-- TOC entry 4412 (class 3256 OID 74625)
-- Name: students Allow anonymous read access to students; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous read access to students" ON "public"."students" FOR SELECT TO "anon" USING (true);


--
-- TOC entry 4415 (class 3256 OID 74626)
-- Name: users Allow anonymous read access to users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous read access to users" ON "public"."users" FOR SELECT TO "anon" USING (true);


--
-- TOC entry 4413 (class 3256 OID 74628)
-- Name: users Allow anonymous update last_login; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous update last_login" ON "public"."users" FOR UPDATE TO "anon" USING (true) WITH CHECK (true);


--
-- TOC entry 4399 (class 0 OID 17521)
-- Dependencies: 371
-- Name: admin_users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4411 (class 0 OID 106543)
-- Dependencies: 407
-- Name: auto_timeout_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."auto_timeout_logs" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4410 (class 0 OID 90302)
-- Dependencies: 394
-- Name: rfid_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."rfid_logs" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4406 (class 0 OID 17915)
-- Dependencies: 386
-- Name: students; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."students" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4409 (class 0 OID 74562)
-- Dependencies: 391
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4400 (class 0 OID 17547)
-- Dependencies: 375
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE "realtime"."messages" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4401 (class 0 OID 17566)
-- Dependencies: 379
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4408 (class 0 OID 73408)
-- Dependencies: 389
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets_analytics" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4402 (class 0 OID 17575)
-- Dependencies: 380
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4403 (class 0 OID 17579)
-- Dependencies: 381
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4407 (class 0 OID 73363)
-- Dependencies: 388
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."prefixes" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4404 (class 0 OID 17589)
-- Dependencies: 382
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4405 (class 0 OID 17596)
-- Dependencies: 383
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4419 (class 6104 OID 17822)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION "supabase_realtime" WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 4418 (class 6104 OID 90579)
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION "supabase_realtime_messages_publication" WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 4421 (class 6106 OID 100912)
-- Name: supabase_realtime admin_users; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."admin_users";


--
-- TOC entry 4422 (class 6106 OID 100913)
-- Name: supabase_realtime announcements; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."announcements";


--
-- TOC entry 4423 (class 6106 OID 100914)
-- Name: supabase_realtime rfid_logs; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."rfid_logs";


--
-- TOC entry 4420 (class 6106 OID 90580)
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: -
--

ALTER PUBLICATION "supabase_realtime_messages_publication" ADD TABLE ONLY "realtime"."messages";


--
-- TOC entry 3813 (class 3466 OID 17864)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_graphql_placeholder" ON "sql_drop"
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION "extensions"."set_graphql_placeholder"();


--
-- TOC entry 3818 (class 3466 OID 17907)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_cron_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_cron_access"();


--
-- TOC entry 3812 (class 3466 OID 17863)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_graphql_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION "extensions"."grant_pg_graphql_access"();


--
-- TOC entry 3819 (class 3466 OID 17908)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_net_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_net_access"();


--
-- TOC entry 3814 (class 3466 OID 17865)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "pgrst_ddl_watch" ON "ddl_command_end"
   EXECUTE FUNCTION "extensions"."pgrst_ddl_watch"();


--
-- TOC entry 3815 (class 3466 OID 17866)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "pgrst_drop_watch" ON "sql_drop"
   EXECUTE FUNCTION "extensions"."pgrst_drop_watch"();


-- Completed on 2025-11-11 01:40:43

--
-- PostgreSQL database dump complete
--

