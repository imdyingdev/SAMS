--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5

-- Started on 2025-11-05 00:04:55

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
-- TOC entry 4468 (class 0 OID 0)
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
-- TOC entry 4469 (class 0 OID 0)
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
-- TOC entry 4470 (class 0 OID 0)
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
-- TOC entry 4471 (class 0 OID 0)
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
-- TOC entry 4472 (class 0 OID 0)
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
-- TOC entry 4473 (class 0 OID 0)
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
-- TOC entry 4474 (class 0 OID 0)
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
-- TOC entry 4475 (class 0 OID 0)
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
-- TOC entry 4476 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1205 (class 1247 OID 17308)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."aal_level" AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- TOC entry 1208 (class 1247 OID 17316)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."code_challenge_method" AS ENUM (
    's256',
    'plain'
);


--
-- TOC entry 1211 (class 1247 OID 17322)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_status" AS ENUM (
    'unverified',
    'verified'
);


--
-- TOC entry 1214 (class 1247 OID 17328)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_type" AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- TOC entry 1399 (class 1247 OID 85746)
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_authorization_status" AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- TOC entry 1411 (class 1247 OID 85819)
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_client_type" AS ENUM (
    'public',
    'confidential'
);


--
-- TOC entry 1341 (class 1247 OID 33498)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_registration_type" AS ENUM (
    'dynamic',
    'manual'
);


--
-- TOC entry 1402 (class 1247 OID 85756)
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."oauth_response_type" AS ENUM (
    'code'
);


--
-- TOC entry 1217 (class 1247 OID 17336)
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
-- TOC entry 1220 (class 1247 OID 17350)
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
-- TOC entry 1223 (class 1247 OID 17362)
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
-- TOC entry 1226 (class 1247 OID 17379)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."user_defined_filter" AS (
	"column_name" "text",
	"op" "realtime"."equality_op",
	"value" "text"
);


--
-- TOC entry 1229 (class 1247 OID 17382)
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
-- TOC entry 1232 (class 1247 OID 17385)
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
-- TOC entry 537 (class 1255 OID 17386)
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
-- TOC entry 4477 (class 0 OID 0)
-- Dependencies: 537
-- Name: FUNCTION "email"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."email"() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 440 (class 1255 OID 17387)
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
-- TOC entry 423 (class 1255 OID 17388)
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
-- TOC entry 4478 (class 0 OID 0)
-- Dependencies: 423
-- Name: FUNCTION "role"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."role"() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 508 (class 1255 OID 17389)
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
-- TOC entry 4479 (class 0 OID 0)
-- Dependencies: 508
-- Name: FUNCTION "uid"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."uid"() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 420 (class 1255 OID 17390)
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
-- TOC entry 4480 (class 0 OID 0)
-- Dependencies: 420
-- Name: FUNCTION "grant_pg_cron_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_cron_access"() IS 'Grants access to pg_cron';


--
-- TOC entry 451 (class 1255 OID 17391)
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
-- TOC entry 4481 (class 0 OID 0)
-- Dependencies: 451
-- Name: FUNCTION "grant_pg_graphql_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_graphql_access"() IS 'Grants access to pg_graphql';


--
-- TOC entry 432 (class 1255 OID 17392)
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
-- TOC entry 4482 (class 0 OID 0)
-- Dependencies: 432
-- Name: FUNCTION "grant_pg_net_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_net_access"() IS 'Grants access to pg_net';


--
-- TOC entry 556 (class 1255 OID 17393)
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
-- TOC entry 511 (class 1255 OID 17394)
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
-- TOC entry 538 (class 1255 OID 17395)
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
-- TOC entry 4483 (class 0 OID 0)
-- Dependencies: 538
-- Name: FUNCTION "set_graphql_placeholder"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."set_graphql_placeholder"() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 490 (class 1255 OID 17396)
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
-- TOC entry 530 (class 1255 OID 74591)
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
-- TOC entry 4484 (class 0 OID 0)
-- Dependencies: 530
-- Name: FUNCTION "update_user_last_login"("user_email" "text"); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION "public"."update_user_last_login"("user_email" "text") IS 'Updates last_login timestamp for a user by email.';


--
-- TOC entry 565 (class 1255 OID 74589)
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
-- TOC entry 573 (class 1255 OID 17397)
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
-- TOC entry 434 (class 1255 OID 17399)
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
-- TOC entry 578 (class 1255 OID 17400)
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
-- TOC entry 454 (class 1255 OID 17401)
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
-- TOC entry 471 (class 1255 OID 17402)
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
-- TOC entry 482 (class 1255 OID 17403)
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
-- TOC entry 422 (class 1255 OID 17404)
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
-- TOC entry 475 (class 1255 OID 17405)
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
-- TOC entry 492 (class 1255 OID 17406)
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
-- TOC entry 575 (class 1255 OID 17407)
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
-- TOC entry 442 (class 1255 OID 17408)
-- Name: to_regrole("text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."to_regrole"("role_name" "text") RETURNS "regrole"
    LANGUAGE "sql" IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- TOC entry 483 (class 1255 OID 17409)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."topic"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- TOC entry 494 (class 1255 OID 73380)
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
-- TOC entry 453 (class 1255 OID 17410)
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
-- TOC entry 436 (class 1255 OID 73421)
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
-- TOC entry 445 (class 1255 OID 73381)
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
-- TOC entry 429 (class 1255 OID 73384)
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
-- TOC entry 480 (class 1255 OID 73399)
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
-- TOC entry 499 (class 1255 OID 17411)
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
-- TOC entry 481 (class 1255 OID 17412)
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
-- TOC entry 448 (class 1255 OID 17413)
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
-- TOC entry 460 (class 1255 OID 73362)
-- Name: get_level("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_level"("name" "text") RETURNS integer
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- TOC entry 539 (class 1255 OID 73378)
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
-- TOC entry 562 (class 1255 OID 73379)
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
-- TOC entry 555 (class 1255 OID 73397)
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
-- TOC entry 543 (class 1255 OID 17415)
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
-- TOC entry 461 (class 1255 OID 17416)
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
-- TOC entry 450 (class 1255 OID 73420)
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
-- TOC entry 425 (class 1255 OID 73422)
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
-- TOC entry 558 (class 1255 OID 73383)
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
-- TOC entry 504 (class 1255 OID 73423)
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
-- TOC entry 524 (class 1255 OID 73428)
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
-- TOC entry 532 (class 1255 OID 73398)
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
-- TOC entry 426 (class 1255 OID 17417)
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
-- TOC entry 433 (class 1255 OID 73424)
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
-- TOC entry 563 (class 1255 OID 73382)
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
-- TOC entry 549 (class 1255 OID 17418)
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
-- TOC entry 521 (class 1255 OID 73395)
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
-- TOC entry 534 (class 1255 OID 73394)
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
-- TOC entry 435 (class 1255 OID 73419)
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
-- TOC entry 500 (class 1255 OID 17419)
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
-- TOC entry 350 (class 1259 OID 17420)
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
-- TOC entry 4485 (class 0 OID 0)
-- Dependencies: 350
-- Name: TABLE "audit_log_entries"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."audit_log_entries" IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 351 (class 1259 OID 17426)
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
-- TOC entry 4486 (class 0 OID 0)
-- Dependencies: 351
-- Name: TABLE "flow_state"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."flow_state" IS 'stores metadata for pkce logins';


--
-- TOC entry 352 (class 1259 OID 17431)
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
-- TOC entry 4487 (class 0 OID 0)
-- Dependencies: 352
-- Name: TABLE "identities"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."identities" IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4488 (class 0 OID 0)
-- Dependencies: 352
-- Name: COLUMN "identities"."email"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."identities"."email" IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 353 (class 1259 OID 17438)
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
-- TOC entry 4489 (class 0 OID 0)
-- Dependencies: 353
-- Name: TABLE "instances"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."instances" IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 354 (class 1259 OID 17443)
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
-- TOC entry 4490 (class 0 OID 0)
-- Dependencies: 354
-- Name: TABLE "mfa_amr_claims"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_amr_claims" IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 355 (class 1259 OID 17448)
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
-- TOC entry 4491 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE "mfa_challenges"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_challenges" IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 356 (class 1259 OID 17453)
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
    "web_authn_aaguid" "uuid"
);


--
-- TOC entry 4492 (class 0 OID 0)
-- Dependencies: 356
-- Name: TABLE "mfa_factors"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_factors" IS 'auth: stores metadata about factors';


--
-- TOC entry 388 (class 1259 OID 85759)
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
-- TOC entry 383 (class 1259 OID 33503)
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
-- TOC entry 389 (class 1259 OID 85792)
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
-- TOC entry 357 (class 1259 OID 17458)
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
-- TOC entry 358 (class 1259 OID 17466)
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
-- TOC entry 4493 (class 0 OID 0)
-- Dependencies: 358
-- Name: TABLE "refresh_tokens"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."refresh_tokens" IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 359 (class 1259 OID 17471)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4494 (class 0 OID 0)
-- Dependencies: 359
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNED BY "auth"."refresh_tokens"."id";


--
-- TOC entry 360 (class 1259 OID 17472)
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
-- TOC entry 4495 (class 0 OID 0)
-- Dependencies: 360
-- Name: TABLE "saml_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_providers" IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 361 (class 1259 OID 17480)
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
-- TOC entry 4496 (class 0 OID 0)
-- Dependencies: 361
-- Name: TABLE "saml_relay_states"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_relay_states" IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 362 (class 1259 OID 17486)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);


--
-- TOC entry 4497 (class 0 OID 0)
-- Dependencies: 362
-- Name: TABLE "schema_migrations"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."schema_migrations" IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 363 (class 1259 OID 17489)
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
    "oauth_client_id" "uuid"
);


--
-- TOC entry 4498 (class 0 OID 0)
-- Dependencies: 363
-- Name: TABLE "sessions"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sessions" IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4499 (class 0 OID 0)
-- Dependencies: 363
-- Name: COLUMN "sessions"."not_after"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."not_after" IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 364 (class 1259 OID 17494)
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
-- TOC entry 4500 (class 0 OID 0)
-- Dependencies: 364
-- Name: TABLE "sso_domains"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_domains" IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 365 (class 1259 OID 17500)
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
-- TOC entry 4501 (class 0 OID 0)
-- Dependencies: 365
-- Name: TABLE "sso_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_providers" IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4502 (class 0 OID 0)
-- Dependencies: 365
-- Name: COLUMN "sso_providers"."resource_id"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sso_providers"."resource_id" IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 366 (class 1259 OID 17506)
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
-- TOC entry 4503 (class 0 OID 0)
-- Dependencies: 366
-- Name: TABLE "users"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."users" IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4504 (class 0 OID 0)
-- Dependencies: 366
-- Name: COLUMN "users"."is_sso_user"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."users"."is_sso_user" IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 367 (class 1259 OID 17521)
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
-- TOC entry 368 (class 1259 OID 17527)
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
-- TOC entry 4505 (class 0 OID 0)
-- Dependencies: 368
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."admin_users_id_seq" OWNED BY "public"."admin_users"."id";


--
-- TOC entry 396 (class 1259 OID 93012)
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
-- TOC entry 4506 (class 0 OID 0)
-- Dependencies: 396
-- Name: TABLE "announcements"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."announcements" IS 'Stores system announcements created by administrators';


--
-- TOC entry 4507 (class 0 OID 0)
-- Dependencies: 396
-- Name: COLUMN "announcements"."id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."announcements"."id" IS 'Unique identifier for each announcement';


--
-- TOC entry 4508 (class 0 OID 0)
-- Dependencies: 396
-- Name: COLUMN "announcements"."title"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."announcements"."title" IS 'Title of the announcement';


--
-- TOC entry 4509 (class 0 OID 0)
-- Dependencies: 396
-- Name: COLUMN "announcements"."content"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."announcements"."content" IS 'Full content/body of the announcement';


--
-- TOC entry 4510 (class 0 OID 0)
-- Dependencies: 396
-- Name: COLUMN "announcements"."created_at"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."announcements"."created_at" IS 'Timestamp when announcement was created';


--
-- TOC entry 4511 (class 0 OID 0)
-- Dependencies: 396
-- Name: COLUMN "announcements"."updated_at"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."announcements"."updated_at" IS 'Timestamp when announcement was last updated';


--
-- TOC entry 395 (class 1259 OID 93011)
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
-- TOC entry 4512 (class 0 OID 0)
-- Dependencies: 395
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."announcements_id_seq" OWNED BY "public"."announcements"."id";


--
-- TOC entry 394 (class 1259 OID 90482)
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
-- TOC entry 393 (class 1259 OID 90481)
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
-- TOC entry 4513 (class 0 OID 0)
-- Dependencies: 393
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."attendance_id_seq" OWNED BY "public"."attendance"."id";


--
-- TOC entry 405 (class 1259 OID 106543)
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
-- TOC entry 4514 (class 0 OID 0)
-- Dependencies: 405
-- Name: TABLE "auto_timeout_logs"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."auto_timeout_logs" IS 'Logs all automatic timeout insertions for students who forgot to tap out';


--
-- TOC entry 401 (class 1259 OID 104260)
-- Name: email_verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."email_verifications" (
    "email" "text" NOT NULL,
    "code" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- TOC entry 369 (class 1259 OID 17536)
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
-- TOC entry 370 (class 1259 OID 17540)
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
-- TOC entry 4515 (class 0 OID 0)
-- Dependencies: 370
-- Name: login_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."login_logs_id_seq" OWNED BY "public"."login_logs"."id";


--
-- TOC entry 390 (class 1259 OID 90302)
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
-- TOC entry 391 (class 1259 OID 90316)
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
-- TOC entry 382 (class 1259 OID 17915)
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."students" (
    "id" bigint NOT NULL,
    "first_name" "text" NOT NULL,
    "middle_name" "text",
    "last_name" "text" NOT NULL,
    "suffix" "text",
    "lrn" bigint NOT NULL,
    "grade_level" "text" NOT NULL,
    "rfid" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "gender" character varying(10) DEFAULT 'Male'::character varying,
    "section" "text",
    CONSTRAINT "students_gender_check" CHECK ((("gender")::"text" = ANY ((ARRAY['Male'::character varying, 'Female'::character varying])::"text"[])))
);


--
-- TOC entry 4516 (class 0 OID 0)
-- Dependencies: 382
-- Name: TABLE "students"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."students" IS 'Student data cleared - table structure preserved';


--
-- TOC entry 4517 (class 0 OID 0)
-- Dependencies: 382
-- Name: COLUMN "students"."id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."id" IS 'Unique identifier for each student.';


--
-- TOC entry 4518 (class 0 OID 0)
-- Dependencies: 382
-- Name: COLUMN "students"."first_name"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."first_name" IS 'Student''s first name.';


--
-- TOC entry 4519 (class 0 OID 0)
-- Dependencies: 382
-- Name: COLUMN "students"."middle_name"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."middle_name" IS 'Student''s middle name.';


--
-- TOC entry 4520 (class 0 OID 0)
-- Dependencies: 382
-- Name: COLUMN "students"."last_name"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."last_name" IS 'Student''s last name.';


--
-- TOC entry 4521 (class 0 OID 0)
-- Dependencies: 382
-- Name: COLUMN "students"."suffix"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."suffix" IS 'Student''s suffix (e.g., Jr., Sr.).';


--
-- TOC entry 4522 (class 0 OID 0)
-- Dependencies: 382
-- Name: COLUMN "students"."lrn"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."lrn" IS 'Learner Reference Number, a unique 12-digit identifier.';


--
-- TOC entry 4523 (class 0 OID 0)
-- Dependencies: 382
-- Name: COLUMN "students"."grade_level"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."grade_level" IS 'The current grade level of the student.';


--
-- TOC entry 4524 (class 0 OID 0)
-- Dependencies: 382
-- Name: COLUMN "students"."rfid"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."rfid" IS 'The unique ID of the RFID card assigned to the student (stored as integer).';


--
-- TOC entry 4525 (class 0 OID 0)
-- Dependencies: 382
-- Name: COLUMN "students"."created_at"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."created_at" IS 'Timestamp of when the record was created.';


--
-- TOC entry 4526 (class 0 OID 0)
-- Dependencies: 382
-- Name: COLUMN "students"."gender"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."gender" IS 'Student gender (Male or Female).';


--
-- TOC entry 4527 (class 0 OID 0)
-- Dependencies: 382
-- Name: COLUMN "students"."section"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."students"."section" IS 'The section/class within the grade level (e.g., Section A, Section B)';


--
-- TOC entry 387 (class 1259 OID 74562)
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
-- TOC entry 4528 (class 0 OID 0)
-- Dependencies: 387
-- Name: TABLE "users"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."users" IS 'User data cleared - table structure preserved';


--
-- TOC entry 4529 (class 0 OID 0)
-- Dependencies: 387
-- Name: COLUMN "users"."id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."id" IS 'Unique identifier for each user account.';


--
-- TOC entry 4530 (class 0 OID 0)
-- Dependencies: 387
-- Name: COLUMN "users"."student_id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."student_id" IS 'References students.id - allows login with LRN or student ID.';


--
-- TOC entry 4531 (class 0 OID 0)
-- Dependencies: 387
-- Name: COLUMN "users"."email"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."email" IS 'Student email address for login.';


--
-- TOC entry 4532 (class 0 OID 0)
-- Dependencies: 387
-- Name: COLUMN "users"."password_hash"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."password_hash" IS 'Bcrypt hashed password for security.';


--
-- TOC entry 4533 (class 0 OID 0)
-- Dependencies: 387
-- Name: COLUMN "users"."is_active"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."is_active" IS 'Whether the user account is active and can login.';


--
-- TOC entry 4534 (class 0 OID 0)
-- Dependencies: 387
-- Name: COLUMN "users"."created_at"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."created_at" IS 'Timestamp when user account was created.';


--
-- TOC entry 4535 (class 0 OID 0)
-- Dependencies: 387
-- Name: COLUMN "users"."updated_at"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."updated_at" IS 'Timestamp when user account was last updated.';


--
-- TOC entry 4536 (class 0 OID 0)
-- Dependencies: 387
-- Name: COLUMN "users"."last_login"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."users"."last_login" IS 'Timestamp of last successful login.';


--
-- TOC entry 392 (class 1259 OID 90415)
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
    "s"."grade_level",
    "s"."rfid",
    "s"."gender",
    "s"."created_at" AS "student_created_at"
   FROM ("public"."users" "u"
     JOIN "public"."students" "s" ON (("u"."student_id" = "s"."id")))
  WHERE ("u"."is_active" = true);


--
-- TOC entry 4537 (class 0 OID 0)
-- Dependencies: 392
-- Name: VIEW "student_users"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW "public"."student_users" IS 'Combined view of users and students data for mobile app authentication.';


--
-- TOC entry 381 (class 1259 OID 17914)
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
-- TOC entry 386 (class 1259 OID 74561)
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
-- TOC entry 371 (class 1259 OID 17547)
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
-- TOC entry 397 (class 1259 OID 99760)
-- Name: messages_2025_11_01; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages_2025_11_01" (
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
-- TOC entry 398 (class 1259 OID 100877)
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
-- TOC entry 399 (class 1259 OID 103129)
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
-- TOC entry 400 (class 1259 OID 103141)
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
-- TOC entry 402 (class 1259 OID 104290)
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
-- TOC entry 403 (class 1259 OID 105405)
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
-- TOC entry 404 (class 1259 OID 106527)
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
-- TOC entry 372 (class 1259 OID 17554)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."schema_migrations" (
    "version" bigint NOT NULL,
    "inserted_at" timestamp(0) without time zone
);


--
-- TOC entry 373 (class 1259 OID 17557)
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
-- TOC entry 374 (class 1259 OID 17565)
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
-- TOC entry 375 (class 1259 OID 17566)
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
-- TOC entry 4538 (class 0 OID 0)
-- Dependencies: 375
-- Name: COLUMN "buckets"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."buckets"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 385 (class 1259 OID 73408)
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
-- TOC entry 376 (class 1259 OID 17575)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 377 (class 1259 OID 17579)
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
-- TOC entry 4539 (class 0 OID 0)
-- Dependencies: 377
-- Name: COLUMN "objects"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."objects"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 384 (class 1259 OID 73363)
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
-- TOC entry 378 (class 1259 OID 17589)
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
-- TOC entry 379 (class 1259 OID 17596)
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
-- TOC entry 3816 (class 0 OID 0)
-- Name: messages_2025_11_01; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_01" FOR VALUES FROM ('2025-11-01 00:00:00') TO ('2025-11-02 00:00:00');


--
-- TOC entry 3817 (class 0 OID 0)
-- Name: messages_2025_11_02; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_02" FOR VALUES FROM ('2025-11-02 00:00:00') TO ('2025-11-03 00:00:00');


--
-- TOC entry 3818 (class 0 OID 0)
-- Name: messages_2025_11_03; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_03" FOR VALUES FROM ('2025-11-03 00:00:00') TO ('2025-11-04 00:00:00');


--
-- TOC entry 3819 (class 0 OID 0)
-- Name: messages_2025_11_04; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_04" FOR VALUES FROM ('2025-11-04 00:00:00') TO ('2025-11-05 00:00:00');


--
-- TOC entry 3820 (class 0 OID 0)
-- Name: messages_2025_11_05; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_05" FOR VALUES FROM ('2025-11-05 00:00:00') TO ('2025-11-06 00:00:00');


--
-- TOC entry 3821 (class 0 OID 0)
-- Name: messages_2025_11_06; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_06" FOR VALUES FROM ('2025-11-06 00:00:00') TO ('2025-11-07 00:00:00');


--
-- TOC entry 3822 (class 0 OID 0)
-- Name: messages_2025_11_07; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages" ATTACH PARTITION "realtime"."messages_2025_11_07" FOR VALUES FROM ('2025-11-07 00:00:00') TO ('2025-11-08 00:00:00');


--
-- TOC entry 3833 (class 2604 OID 17604)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass");


--
-- TOC entry 3843 (class 2604 OID 17605)
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."admin_users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."admin_users_id_seq"'::"regclass");


--
-- TOC entry 3897 (class 2604 OID 93015)
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."announcements" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."announcements_id_seq"'::"regclass");


--
-- TOC entry 3895 (class 2604 OID 90485)
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."attendance" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."attendance_id_seq"'::"regclass");


--
-- TOC entry 3847 (class 2604 OID 17607)
-- Name: login_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."login_logs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."login_logs_id_seq"'::"regclass");


--
-- TOC entry 4411 (class 0 OID 17420)
-- Dependencies: 350
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- TOC entry 4412 (class 0 OID 17426)
-- Dependencies: 351
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
\.


--
-- TOC entry 4413 (class 0 OID 17431)
-- Dependencies: 352
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
\.


--
-- TOC entry 4414 (class 0 OID 17438)
-- Dependencies: 353
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4415 (class 0 OID 17443)
-- Dependencies: 354
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
\.


--
-- TOC entry 4416 (class 0 OID 17448)
-- Dependencies: 355
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- TOC entry 4417 (class 0 OID 17453)
-- Dependencies: 356
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid") FROM stdin;
\.


--
-- TOC entry 4447 (class 0 OID 85759)
-- Dependencies: 388
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at") FROM stdin;
\.


--
-- TOC entry 4442 (class 0 OID 33503)
-- Dependencies: 383
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type") FROM stdin;
\.


--
-- TOC entry 4448 (class 0 OID 85792)
-- Dependencies: 389
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- TOC entry 4418 (class 0 OID 17458)
-- Dependencies: 357
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4419 (class 0 OID 17466)
-- Dependencies: 358
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
\.


--
-- TOC entry 4421 (class 0 OID 17472)
-- Dependencies: 360
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- TOC entry 4422 (class 0 OID 17480)
-- Dependencies: 361
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- TOC entry 4423 (class 0 OID 17486)
-- Dependencies: 362
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
\.


--
-- TOC entry 4424 (class 0 OID 17489)
-- Dependencies: 363
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id") FROM stdin;
\.


--
-- TOC entry 4425 (class 0 OID 17494)
-- Dependencies: 364
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4426 (class 0 OID 17500)
-- Dependencies: 365
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- TOC entry 4427 (class 0 OID 17506)
-- Dependencies: 366
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
\.


--
-- TOC entry 3811 (class 0 OID 106580)
-- Dependencies: 407
-- Data for Name: job; Type: TABLE DATA; Schema: cron; Owner: -
--

COPY "cron"."job" ("jobid", "schedule", "command", "nodename", "nodeport", "database", "username", "active", "jobname") FROM stdin;
4	0 10 * * 1-5	\r\n  SELECT net.http_post(\r\n    url := 'https://dieyszynhfhlplalfawk.supabase.co/functions/v1/auto-timeout',\r\n    headers := jsonb_build_object(\r\n      'Content-Type', 'application/json',\r\n      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZXlzenluaGZobHBsYWxmYXdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjIyNjk3MCwiZXhwIjoyMDY3ODAyOTcwfQ.wcupFhLE_Zrvk2iAd9Glc_3d1QU8E9RDWKijp7MOaEw'\r\n    )\r\n  ) as request_id;\r\n  	localhost	5432	postgres	postgres	t	auto-timeout-daily
\.


--
-- TOC entry 3813 (class 0 OID 106599)
-- Dependencies: 409
-- Data for Name: job_run_details; Type: TABLE DATA; Schema: cron; Owner: -
--

COPY "cron"."job_run_details" ("jobid", "runid", "job_pid", "database", "username", "command", "status", "return_message", "start_time", "end_time") FROM stdin;
\.


--
-- TOC entry 4428 (class 0 OID 17521)
-- Dependencies: 367
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."admin_users" ("id", "username", "password_hash", "role", "is_active", "created_at") FROM stdin;
63	admin	$2b$10$Sjso5BmrfShYxxTPGUHzpODIW3uX0fweenQPZP/Skcb3qc56MtGqy	administrator	t	2025-10-23 07:35:44.117103
\.


--
-- TOC entry 4453 (class 0 OID 93012)
-- Dependencies: 396
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."announcements" ("id", "title", "content", "created_at", "updated_at") FROM stdin;
13	System Integration Announcement	We are pleased to announce that this November 3, our Student Attendance Management System (SAMS) will be officially integrated into Ampid 1 Elementary School. This system aims to modernize and streamline student attendance tracking, ensuring accuracy, efficiency, and transparency in daily attendance records.\n\nThrough SAMS, teachers and administrators can easily manage attendance reports, while parents can stay informed about their child’s attendance status. This integration marks an important step toward digital transformation in our school’s record management.	2025-11-02 11:49:40.6995+00	2025-11-02 11:59:46.055768+00
\.


--
-- TOC entry 4451 (class 0 OID 90482)
-- Dependencies: 394
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."attendance" ("id", "student_id", "attendance_date", "status", "notes", "recorded_by", "recorded_at") FROM stdin;
\.


--
-- TOC entry 4462 (class 0 OID 106543)
-- Dependencies: 405
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
\.


--
-- TOC entry 4458 (class 0 OID 104260)
-- Dependencies: 401
-- Data for Name: email_verifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."email_verifications" ("email", "code", "expires_at", "created_at") FROM stdin;
johnrgrafe@gmail.com	90215	2025-11-02 18:02:17.721+00	2025-11-02 17:52:17.733+00
\.


--
-- TOC entry 4430 (class 0 OID 17536)
-- Dependencies: 369
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
\.


--
-- TOC entry 4449 (class 0 OID 90302)
-- Dependencies: 390
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
\.


--
-- TOC entry 4441 (class 0 OID 17915)
-- Dependencies: 382
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."students" ("id", "first_name", "middle_name", "last_name", "suffix", "lrn", "grade_level", "rfid", "created_at", "gender", "section") FROM stdin;
41	ZOE JAMILA	V.	APLACADOR		109481230062	Grade 2	308147193	2025-11-03 05:00:14.171805+00	Female	ROSAL
42	ALVI	S.	CULLAMCO		109481230095	Grade 2	308081913	2025-11-03 05:03:50.18554+00	Female	ROSAL
43	ERISH	G.	DEL ROSARIO		109481240048	Grade 1	297377865	2025-11-03 05:45:58.018025+00	Female	MASIPAG
45	CHAELLA SAVANNAH	S.	RIO		109481240132	Grade 1	299103609	2025-11-03 05:49:46.278719+00	Female	MASIPAG
46	MILLARD	G.	SORAINO	III	109481240016	Grade 1	296806985	2025-11-03 05:51:35.538742+00	Male	MASIPAG
47	LEGION	J.	DELA CRUZ		403104240008	Grade 1	292308905	2025-11-03 05:53:05.041433+00	Male	MASIPAG
16	Jhunerva		Tan		123456	Grade 3	1101016103	2025-11-03 02:53:41.395504+00	Female	Mabini
21	KRATOS	P.	CAPILI		109481210154	Grade 4	293477065	2025-11-03 03:26:41.003061+00	Male	MT MAKILING
22	JANNAH KIM	A.	PUNAY		109481210038	Grade 4	293520825	2025-11-03 03:27:40.644516+00	Female	MT MAKILING
23	AIRA MAINE	M.	JOSE		109481210090	Grade 4	293441241	2025-11-03 03:28:43.933708+00	Female	MT MAKILING
27	FRANZHEN	B.	LIVA		109481210016	Grade 4	304798761	2025-11-03 03:32:52.367861+00	Female	MT MAKILING
28	JULIANNA	A.	QUIMBO		109481210192	Grade 4	292613097	2025-11-03 03:33:49.194515+00	Female	MT MAKILING
29	PRINCESS GYLLE	P.	NAM-AY		109481200081	Grade 5	296846777	2025-11-03 03:40:53.857056+00	Female	SILANG
30	ALLIYAH AUDREI	U.	ARTICULO		109481200031	Grade 5	308127897	2025-11-03 03:42:11.026698+00	Female	SILANG
31	DYLAN	C.	RIVERA		109481200206	Grade 5	308559609	2025-11-03 03:43:10.308941+00	Male	SILANG
32	SHEIKHA ANUSHKA	C.	ALAG		109481200068	Grade 5	308181369	2025-11-03 03:44:12.661536+00	Female	SILANG
33	JHEICEL	D.	CARO		109481200073	Grade 5	308372745	2025-11-03 03:45:07.523874+00	Female	SILANG
34	MARK JACOB	A.	REYES		109481200205	Grade 5	305619497	2025-11-03 03:46:06.299884+00	Male	SILANG
35	CALIX ANGELO	C.	PULVERA		109481200222	Grade 5	298837641	2025-11-03 03:47:03.427372+00	Male	SILANG
36	ANIKA	U.	SENTILLAS		109481200187	Grade 5	308402953	2025-11-03 03:47:54.627525+00	Female	SILANG
37	ATHENA ABIGAIL	M.	RAMOS		109481200042	Grade 5	306191849	2025-11-03 03:48:51.934358+00	Female	SILANG
19	JOHN EZEKIEL	R.	LAURIO	\N	109481210107	Grade 4	304416569	2025-11-03 03:24:27.586699+00	Male	MT MAKILING
24	ELISHA MADIE	\N	LORA	\N	109481210213	Grade 4	293955785	2025-11-03 03:29:42.636267+00	Female	MT MAKILING
38	KIEFER JOHN	L.	DE TORRES		109481230016	Grade 2	291757897	2025-11-03 04:49:44.157867+00	Male	ROSAL
39	MAVIN JES	L.	FABUL		109481230037	Grade 2	291623817	2025-11-03 04:53:34.733493+00	Male	ROSAL
40	ROHAN JOYCE	P.	FRONDOZO		109481230030	Grade 2	306098393	2025-11-03 04:57:27.062236+00	Male	ROSAL
48	ERZIKIEL	D.	SIERRA		109481220215	Grade 3	298966905	2025-11-03 05:58:05.88015+00	Male	MARS
49	ELESEO	C.	MANONGSONG		109481220105	Grade 3	1100972749	2025-11-03 05:59:56.045336+00	Male	MARS
50	ELIJAH ROME	C.	MALATE		109481220128	Grade 3	305101593	2025-11-03 06:01:22.03822+00	Male	MARS
51	TIMOTHY EMMANUEL	S.	MINGI		1094812200115	Grade 3	1100979479	2025-11-03 06:03:13.266604+00	Male	MARS
52	ZADE CARLISLE	P.	POLONAN		136481220207	Grade 3	293506217	2025-11-03 06:04:53.709465+00	Male	MARS
53	ACY	B.	CATALAN		115701220005	Grade 3	294788905	2025-11-03 06:05:58.821008+00	Female	MARS
54	JASMINE	A.	VARGAS		109481220058	Grade 3	309381401	2025-11-03 06:07:11.528935+00	Female	MARS
55	ASIA FAITH	R.	BERAYO		109481220066	Grade 3	295114121	2025-11-03 06:08:10.530711+00	Female	MARS
56	AZEYA AYA	S.	SUAREZ		109481220194	Grade 3	296836713	2025-11-03 06:09:43.707169+00	Female	MARS
57	MADISON	S.	RICON		109481220057	Grade 3	294884089	2025-11-03 06:12:08.432757+00	Female	MARS
58	AVRIL LAVIGNE	B.	CONCEPCION		1094811190109	Grade 6	296807385	2025-11-03 06:16:28.755975+00	Male	ROXAS
60	ISABELA	G.	ABELLA		1094811190188	Grade 6	309182473	2025-11-03 06:17:58.900977+00	Female	ROXAS
61	HAINNAH JERISSA	R.	ALIMASA		408981180008	Grade 6	292424393	2025-11-03 06:19:30.994804+00	Female	ROXAS
62	ALISON KATE	F.	HABLA		1094811190078	Grade 6	292301481	2025-11-03 06:20:44.697403+00	Female	ROXAS
63	KAEDDIE YAMILLAH	D.	PALOMADO		109481190085	Grade 6	291973721	2025-11-03 06:22:03.722952+00	Female	ROXAS
64	ALENA GAIL	H.	GERONCA		109481190178	Grade 6	305360425	2025-11-03 06:23:24.887786+00	Female	ROXAS
65	EFREIGN CARLOS	G.	SAMARITA		403101190004	Grade 6	298967657	2025-11-03 06:28:34.862276+00	Male	ROXAS
66	ELNA MAE	P.	MAYOR		109481190083	Grade 6	292210489	2025-11-03 06:29:44.372999+00	Female	ROXAS
67	BLAKE COLLIN	P.	JAMANDRON		109481190170	Grade 6	308432841	2025-11-03 06:31:27.996165+00	Male	ROXAS
68	ZAIREE AINSLIE	Q.	TAÑON		109481190186	Grade 6	308039577	2025-11-03 06:34:06.121698+00	Female	ROXAS
18	GWYNETH AUDREY	V.	RASAY	\N	109481210145	Grade 4	293444025	2025-11-03 03:23:11.030788+00	Female	MT MAKILING
14	John Raymond	Bascug	Grafe	\N	104922090113	Grade 6	1100994932	2025-11-02 13:13:58.594304+00	Male	A
17	MICHAEILA MARIE	D.	ANDRES	\N	109481210009	Grade 4	304652201	2025-11-03 03:21:20.768065+00	Female	MT MAKILING
44	SYDNEY CAITLYN	P.	GRAVAMEN	\N	109481240055	Grade 1	291955241	2025-11-03 05:48:02.299354+00	Female	MASIPAG
20	ROMAR	C.	YANIZA	\N	109481210060	Grade 4	304711385	2025-11-03 03:25:26.536571+00	Male	MT MAKILING
\.


--
-- TOC entry 4446 (class 0 OID 74562)
-- Dependencies: 387
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users" ("id", "student_id", "email", "password_hash", "is_active", "created_at", "updated_at", "last_login") FROM stdin;
9	14	johnrgrafe@gmail.com	MTIzNDU2	t	2025-11-02 17:52:44.047288+00	2025-11-04 03:27:08.932636+00	2025-11-04 03:27:08.609+00
\.


--
-- TOC entry 4454 (class 0 OID 99760)
-- Dependencies: 397
-- Data for Name: messages_2025_11_01; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_01" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4455 (class 0 OID 100877)
-- Dependencies: 398
-- Data for Name: messages_2025_11_02; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_02" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4456 (class 0 OID 103129)
-- Dependencies: 399
-- Data for Name: messages_2025_11_03; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_03" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4457 (class 0 OID 103141)
-- Dependencies: 400
-- Data for Name: messages_2025_11_04; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_04" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4459 (class 0 OID 104290)
-- Dependencies: 402
-- Data for Name: messages_2025_11_05; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_05" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4460 (class 0 OID 105405)
-- Dependencies: 403
-- Data for Name: messages_2025_11_06; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_06" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4461 (class 0 OID 106527)
-- Dependencies: 404
-- Data for Name: messages_2025_11_07; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."messages_2025_11_07" ("topic", "extension", "payload", "event", "private", "updated_at", "inserted_at", "id") FROM stdin;
\.


--
-- TOC entry 4432 (class 0 OID 17554)
-- Dependencies: 372
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
-- TOC entry 4433 (class 0 OID 17557)
-- Dependencies: 373
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."subscription" ("id", "subscription_id", "entity", "filters", "claims", "created_at") FROM stdin;
\.


--
-- TOC entry 4435 (class 0 OID 17566)
-- Dependencies: 375
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
\.


--
-- TOC entry 4444 (class 0 OID 73408)
-- Dependencies: 385
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets_analytics" ("id", "type", "format", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4436 (class 0 OID 17575)
-- Dependencies: 376
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
-- TOC entry 4437 (class 0 OID 17579)
-- Dependencies: 377
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") FROM stdin;
\.


--
-- TOC entry 4443 (class 0 OID 73363)
-- Dependencies: 384
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4438 (class 0 OID 17589)
-- Dependencies: 378
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- TOC entry 4439 (class 0 OID 17596)
-- Dependencies: 379
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- TOC entry 3815 (class 0 OID 17277)
-- Dependencies: 345
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- TOC entry 4540 (class 0 OID 0)
-- Dependencies: 359
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- TOC entry 4541 (class 0 OID 0)
-- Dependencies: 406
-- Name: jobid_seq; Type: SEQUENCE SET; Schema: cron; Owner: -
--

SELECT pg_catalog.setval('"cron"."jobid_seq"', 4, true);


--
-- TOC entry 4542 (class 0 OID 0)
-- Dependencies: 408
-- Name: runid_seq; Type: SEQUENCE SET; Schema: cron; Owner: -
--

SELECT pg_catalog.setval('"cron"."runid_seq"', 1, false);


--
-- TOC entry 4543 (class 0 OID 0)
-- Dependencies: 368
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."admin_users_id_seq"', 64, true);


--
-- TOC entry 4544 (class 0 OID 0)
-- Dependencies: 395
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."announcements_id_seq"', 16, true);


--
-- TOC entry 4545 (class 0 OID 0)
-- Dependencies: 393
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."attendance_id_seq"', 1, false);


--
-- TOC entry 4546 (class 0 OID 0)
-- Dependencies: 370
-- Name: login_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."login_logs_id_seq"', 738, true);


--
-- TOC entry 4547 (class 0 OID 0)
-- Dependencies: 381
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."students_id_seq"', 70, true);


--
-- TOC entry 4548 (class 0 OID 0)
-- Dependencies: 386
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_id_seq"', 9, true);


--
-- TOC entry 4549 (class 0 OID 0)
-- Dependencies: 374
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('"realtime"."subscription_id_seq"', 613, true);


--
-- TOC entry 3985 (class 2606 OID 17610)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "amr_id_pk" PRIMARY KEY ("id");


--
-- TOC entry 3969 (class 2606 OID 17612)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."audit_log_entries"
    ADD CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3973 (class 2606 OID 17614)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."flow_state"
    ADD CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3978 (class 2606 OID 17616)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3980 (class 2606 OID 17618)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_provider_id_provider_unique" UNIQUE ("provider_id", "provider");


--
-- TOC entry 3983 (class 2606 OID 17620)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3987 (class 2606 OID 17622)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE ("session_id", "authentication_method");


--
-- TOC entry 3990 (class 2606 OID 17624)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3993 (class 2606 OID 17626)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE ("last_challenged_at");


--
-- TOC entry 3995 (class 2606 OID 17628)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4113 (class 2606 OID 85780)
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_code_key" UNIQUE ("authorization_code");


--
-- TOC entry 4115 (class 2606 OID 85778)
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_authorization_id_key" UNIQUE ("authorization_id");


--
-- TOC entry 4117 (class 2606 OID 85776)
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4096 (class 2606 OID 33514)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_clients"
    ADD CONSTRAINT "oauth_clients_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4121 (class 2606 OID 85802)
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4123 (class 2606 OID 85804)
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_client_unique" UNIQUE ("user_id", "client_id");


--
-- TOC entry 4000 (class 2606 OID 17630)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4008 (class 2606 OID 17632)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4011 (class 2606 OID 17634)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token");


--
-- TOC entry 4014 (class 2606 OID 17636)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id");


--
-- TOC entry 4016 (class 2606 OID 17638)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4021 (class 2606 OID 17640)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4024 (class 2606 OID 17642)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- TOC entry 4028 (class 2606 OID 17644)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4033 (class 2606 OID 17646)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4036 (class 2606 OID 17648)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_providers"
    ADD CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4049 (class 2606 OID 17650)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");


--
-- TOC entry 4051 (class 2606 OID 17652)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4053 (class 2606 OID 17654)
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4055 (class 2606 OID 17656)
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_username_key" UNIQUE ("username");


--
-- TOC entry 4135 (class 2606 OID 93021)
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4131 (class 2606 OID 90491)
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4133 (class 2606 OID 90493)
-- Name: attendance attendance_student_id_attendance_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_student_id_attendance_date_key" UNIQUE ("student_id", "attendance_date");


--
-- TOC entry 4163 (class 2606 OID 106552)
-- Name: auto_timeout_logs auto_timeout_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auto_timeout_logs"
    ADD CONSTRAINT "auto_timeout_logs_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4150 (class 2606 OID 104267)
-- Name: email_verifications email_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."email_verifications"
    ADD CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("email");


--
-- TOC entry 4057 (class 2606 OID 17662)
-- Name: login_logs login_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."login_logs"
    ADD CONSTRAINT "login_logs_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4129 (class 2606 OID 90311)
-- Name: rfid_logs rfid_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."rfid_logs"
    ADD CONSTRAINT "rfid_logs_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4089 (class 2606 OID 20161)
-- Name: students students_lrn_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_lrn_key" UNIQUE ("lrn");


--
-- TOC entry 4091 (class 2606 OID 17922)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4093 (class 2606 OID 90406)
-- Name: students students_rfid_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_rfid_id_key" UNIQUE ("rfid");


--
-- TOC entry 4106 (class 2606 OID 74575)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");


--
-- TOC entry 4108 (class 2606 OID 74571)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4110 (class 2606 OID 74573)
-- Name: users users_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_student_id_key" UNIQUE ("student_id");


--
-- TOC entry 4060 (class 2606 OID 17668)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4139 (class 2606 OID 99768)
-- Name: messages_2025_11_01 messages_2025_11_01_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_01"
    ADD CONSTRAINT "messages_2025_11_01_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4142 (class 2606 OID 100885)
-- Name: messages_2025_11_02 messages_2025_11_02_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_02"
    ADD CONSTRAINT "messages_2025_11_02_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4145 (class 2606 OID 103137)
-- Name: messages_2025_11_03 messages_2025_11_03_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_03"
    ADD CONSTRAINT "messages_2025_11_03_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4148 (class 2606 OID 103149)
-- Name: messages_2025_11_04 messages_2025_11_04_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_04"
    ADD CONSTRAINT "messages_2025_11_04_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4155 (class 2606 OID 104298)
-- Name: messages_2025_11_05 messages_2025_11_05_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_05"
    ADD CONSTRAINT "messages_2025_11_05_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4158 (class 2606 OID 105413)
-- Name: messages_2025_11_06 messages_2025_11_06_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_06"
    ADD CONSTRAINT "messages_2025_11_06_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4161 (class 2606 OID 106535)
-- Name: messages_2025_11_07 messages_2025_11_07_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages_2025_11_07"
    ADD CONSTRAINT "messages_2025_11_07_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- TOC entry 4065 (class 2606 OID 17670)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."subscription"
    ADD CONSTRAINT "pk_subscription" PRIMARY KEY ("id");


--
-- TOC entry 4062 (class 2606 OID 17672)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- TOC entry 4101 (class 2606 OID 73418)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets_analytics"
    ADD CONSTRAINT "buckets_analytics_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4069 (class 2606 OID 17674)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets"
    ADD CONSTRAINT "buckets_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4071 (class 2606 OID 17676)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_name_key" UNIQUE ("name");


--
-- TOC entry 4073 (class 2606 OID 17678)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4081 (class 2606 OID 17680)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4099 (class 2606 OID 73372)
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_pkey" PRIMARY KEY ("bucket_id", "level", "name");


--
-- TOC entry 4086 (class 2606 OID 17682)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_pkey" PRIMARY KEY ("id");


--
-- TOC entry 4084 (class 2606 OID 17684)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_pkey" PRIMARY KEY ("id");


--
-- TOC entry 3970 (class 1259 OID 17685)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" USING "btree" ("instance_id");


--
-- TOC entry 4039 (class 1259 OID 17686)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" USING "btree" ("confirmation_token") WHERE (("confirmation_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 4040 (class 1259 OID 17687)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" USING "btree" ("email_change_token_current") WHERE (("email_change_token_current")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 4041 (class 1259 OID 17688)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" USING "btree" ("email_change_token_new") WHERE (("email_change_token_new")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 3991 (class 1259 OID 17689)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" USING "btree" ("user_id", "created_at");


--
-- TOC entry 3971 (class 1259 OID 17690)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" USING "btree" ("created_at" DESC);


--
-- TOC entry 3976 (class 1259 OID 17691)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_email_idx" ON "auth"."identities" USING "btree" ("email" "text_pattern_ops");


--
-- TOC entry 4550 (class 0 OID 0)
-- Dependencies: 3976
-- Name: INDEX "identities_email_idx"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."identities_email_idx" IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 3981 (class 1259 OID 17692)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_user_id_idx" ON "auth"."identities" USING "btree" ("user_id");


--
-- TOC entry 3974 (class 1259 OID 17693)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_auth_code" ON "auth"."flow_state" USING "btree" ("auth_code");


--
-- TOC entry 3975 (class 1259 OID 17694)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" USING "btree" ("user_id", "authentication_method");


--
-- TOC entry 3988 (class 1259 OID 17695)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" USING "btree" ("created_at" DESC);


--
-- TOC entry 3996 (class 1259 OID 17696)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" USING "btree" ("friendly_name", "user_id") WHERE (TRIM(BOTH FROM "friendly_name") <> ''::"text");


--
-- TOC entry 3997 (class 1259 OID 17697)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" USING "btree" ("user_id");


--
-- TOC entry 4111 (class 1259 OID 85791)
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_auth_pending_exp_idx" ON "auth"."oauth_authorizations" USING "btree" ("expires_at") WHERE ("status" = 'pending'::"auth"."oauth_authorization_status");


--
-- TOC entry 4094 (class 1259 OID 33518)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_clients_deleted_at_idx" ON "auth"."oauth_clients" USING "btree" ("deleted_at");


--
-- TOC entry 4118 (class 1259 OID 85817)
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_active_client_idx" ON "auth"."oauth_consents" USING "btree" ("client_id") WHERE ("revoked_at" IS NULL);


--
-- TOC entry 4119 (class 1259 OID 85815)
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_active_user_client_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "client_id") WHERE ("revoked_at" IS NULL);


--
-- TOC entry 4124 (class 1259 OID 85816)
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "oauth_consents_user_order_idx" ON "auth"."oauth_consents" USING "btree" ("user_id", "granted_at" DESC);


--
-- TOC entry 4001 (class 1259 OID 17698)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("relates_to");


--
-- TOC entry 4002 (class 1259 OID 17699)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("token_hash");


--
-- TOC entry 4003 (class 1259 OID 17700)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" USING "btree" ("user_id", "token_type");


--
-- TOC entry 4042 (class 1259 OID 17701)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" USING "btree" ("reauthentication_token") WHERE (("reauthentication_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 4043 (class 1259 OID 17702)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" USING "btree" ("recovery_token") WHERE (("recovery_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- TOC entry 4004 (class 1259 OID 17703)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id");


--
-- TOC entry 4005 (class 1259 OID 17704)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id", "user_id");


--
-- TOC entry 4006 (class 1259 OID 17705)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" USING "btree" ("parent");


--
-- TOC entry 4009 (class 1259 OID 17706)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" USING "btree" ("session_id", "revoked");


--
-- TOC entry 4012 (class 1259 OID 17707)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" USING "btree" ("updated_at" DESC);


--
-- TOC entry 4017 (class 1259 OID 17708)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" USING "btree" ("sso_provider_id");


--
-- TOC entry 4018 (class 1259 OID 17709)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" USING "btree" ("created_at" DESC);


--
-- TOC entry 4019 (class 1259 OID 17710)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" USING "btree" ("for_email");


--
-- TOC entry 4022 (class 1259 OID 17711)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" USING "btree" ("sso_provider_id");


--
-- TOC entry 4025 (class 1259 OID 17712)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" USING "btree" ("not_after" DESC);


--
-- TOC entry 4026 (class 1259 OID 85829)
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_oauth_client_id_idx" ON "auth"."sessions" USING "btree" ("oauth_client_id");


--
-- TOC entry 4029 (class 1259 OID 17713)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" USING "btree" ("user_id");


--
-- TOC entry 4031 (class 1259 OID 17714)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" USING "btree" ("lower"("domain"));


--
-- TOC entry 4034 (class 1259 OID 17715)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" USING "btree" ("sso_provider_id");


--
-- TOC entry 4037 (class 1259 OID 17716)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" USING "btree" ("lower"("resource_id"));


--
-- TOC entry 4038 (class 1259 OID 33496)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sso_providers_resource_id_pattern_idx" ON "auth"."sso_providers" USING "btree" ("resource_id" "text_pattern_ops");


--
-- TOC entry 3998 (class 1259 OID 17717)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" USING "btree" ("user_id", "phone");


--
-- TOC entry 4030 (class 1259 OID 17718)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" USING "btree" ("user_id", "created_at");


--
-- TOC entry 4044 (class 1259 OID 17719)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" USING "btree" ("email") WHERE ("is_sso_user" = false);


--
-- TOC entry 4551 (class 0 OID 0)
-- Dependencies: 4044
-- Name: INDEX "users_email_partial_key"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."users_email_partial_key" IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 4045 (class 1259 OID 17720)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING "btree" ("instance_id", "lower"(("email")::"text"));


--
-- TOC entry 4046 (class 1259 OID 17721)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING "btree" ("instance_id");


--
-- TOC entry 4047 (class 1259 OID 17722)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" USING "btree" ("is_anonymous");


--
-- TOC entry 4136 (class 1259 OID 93022)
-- Name: idx_announcements_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_announcements_created_at" ON "public"."announcements" USING "btree" ("created_at" DESC);


--
-- TOC entry 4164 (class 1259 OID 106554)
-- Name: idx_auto_timeout_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_auto_timeout_logs_created_at" ON "public"."auto_timeout_logs" USING "btree" ("created_at" DESC);


--
-- TOC entry 4165 (class 1259 OID 106553)
-- Name: idx_auto_timeout_logs_rfid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_auto_timeout_logs_rfid" ON "public"."auto_timeout_logs" USING "btree" ("rfid");


--
-- TOC entry 4151 (class 1259 OID 104268)
-- Name: idx_email_verifications_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_email_verifications_email" ON "public"."email_verifications" USING "btree" ("email");


--
-- TOC entry 4152 (class 1259 OID 104269)
-- Name: idx_email_verifications_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_email_verifications_expires_at" ON "public"."email_verifications" USING "btree" ("expires_at");


--
-- TOC entry 4125 (class 1259 OID 90312)
-- Name: idx_rfid_logs_rfid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_rfid_logs_rfid" ON "public"."rfid_logs" USING "btree" ("rfid");


--
-- TOC entry 4126 (class 1259 OID 90314)
-- Name: idx_rfid_logs_tap_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_rfid_logs_tap_count" ON "public"."rfid_logs" USING "btree" ("tap_count");


--
-- TOC entry 4127 (class 1259 OID 90313)
-- Name: idx_rfid_logs_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_rfid_logs_timestamp" ON "public"."rfid_logs" USING "btree" ("timestamp" DESC);


--
-- TOC entry 4087 (class 1259 OID 100889)
-- Name: idx_students_section; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_students_section" ON "public"."students" USING "btree" ("section");


--
-- TOC entry 4102 (class 1259 OID 74582)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_users_email" ON "public"."users" USING "btree" ("email");


--
-- TOC entry 4103 (class 1259 OID 74583)
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_users_is_active" ON "public"."users" USING "btree" ("is_active");


--
-- TOC entry 4104 (class 1259 OID 74581)
-- Name: idx_users_student_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_users_student_id" ON "public"."users" USING "btree" ("student_id");


--
-- TOC entry 4063 (class 1259 OID 17723)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "ix_realtime_subscription_entity" ON "realtime"."subscription" USING "btree" ("entity");


--
-- TOC entry 4058 (class 1259 OID 73361)
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_inserted_at_topic_index" ON ONLY "realtime"."messages" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4137 (class 1259 OID 99769)
-- Name: messages_2025_11_01_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_01_inserted_at_topic_idx" ON "realtime"."messages_2025_11_01" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4140 (class 1259 OID 100886)
-- Name: messages_2025_11_02_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_02_inserted_at_topic_idx" ON "realtime"."messages_2025_11_02" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4143 (class 1259 OID 103138)
-- Name: messages_2025_11_03_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_03_inserted_at_topic_idx" ON "realtime"."messages_2025_11_03" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4146 (class 1259 OID 103150)
-- Name: messages_2025_11_04_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_04_inserted_at_topic_idx" ON "realtime"."messages_2025_11_04" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4153 (class 1259 OID 104299)
-- Name: messages_2025_11_05_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_05_inserted_at_topic_idx" ON "realtime"."messages_2025_11_05" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4156 (class 1259 OID 105414)
-- Name: messages_2025_11_06_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_06_inserted_at_topic_idx" ON "realtime"."messages_2025_11_06" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4159 (class 1259 OID 106536)
-- Name: messages_2025_11_07_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "messages_2025_11_07_inserted_at_topic_idx" ON "realtime"."messages_2025_11_07" USING "btree" ("inserted_at" DESC, "topic") WHERE (("extension" = 'broadcast'::"text") AND ("private" IS TRUE));


--
-- TOC entry 4066 (class 1259 OID 17724)
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX "subscription_subscription_id_entity_filters_key" ON "realtime"."subscription" USING "btree" ("subscription_id", "entity", "filters");


--
-- TOC entry 4067 (class 1259 OID 17725)
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING "btree" ("name");


--
-- TOC entry 4074 (class 1259 OID 17726)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING "btree" ("bucket_id", "name");


--
-- TOC entry 4082 (class 1259 OID 17727)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" USING "btree" ("bucket_id", "key", "created_at");


--
-- TOC entry 4075 (class 1259 OID 73390)
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "idx_name_bucket_level_unique" ON "storage"."objects" USING "btree" ("name" COLLATE "C", "bucket_id", "level");


--
-- TOC entry 4076 (class 1259 OID 17728)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" USING "btree" ("bucket_id", "name" COLLATE "C");


--
-- TOC entry 4077 (class 1259 OID 73392)
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_objects_lower_name" ON "storage"."objects" USING "btree" (("path_tokens"["level"]), "lower"("name") "text_pattern_ops", "bucket_id", "level");


--
-- TOC entry 4097 (class 1259 OID 73393)
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_prefixes_lower_name" ON "storage"."prefixes" USING "btree" ("bucket_id", "level", (("string_to_array"("name", '/'::"text"))["level"]), "lower"("name") "text_pattern_ops");


--
-- TOC entry 4078 (class 1259 OID 17729)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "name_prefix_search" ON "storage"."objects" USING "btree" ("name" "text_pattern_ops");


--
-- TOC entry 4079 (class 1259 OID 73391)
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "objects_bucket_id_level_idx" ON "storage"."objects" USING "btree" ("bucket_id", "level", "name" COLLATE "C");


--
-- TOC entry 4172 (class 0 OID 0)
-- Name: messages_2025_11_01_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_01_inserted_at_topic_idx";


--
-- TOC entry 4173 (class 0 OID 0)
-- Name: messages_2025_11_01_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_01_pkey";


--
-- TOC entry 4174 (class 0 OID 0)
-- Name: messages_2025_11_02_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_02_inserted_at_topic_idx";


--
-- TOC entry 4175 (class 0 OID 0)
-- Name: messages_2025_11_02_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_02_pkey";


--
-- TOC entry 4176 (class 0 OID 0)
-- Name: messages_2025_11_03_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_03_inserted_at_topic_idx";


--
-- TOC entry 4177 (class 0 OID 0)
-- Name: messages_2025_11_03_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_03_pkey";


--
-- TOC entry 4178 (class 0 OID 0)
-- Name: messages_2025_11_04_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_04_inserted_at_topic_idx";


--
-- TOC entry 4179 (class 0 OID 0)
-- Name: messages_2025_11_04_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_04_pkey";


--
-- TOC entry 4180 (class 0 OID 0)
-- Name: messages_2025_11_05_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_05_inserted_at_topic_idx";


--
-- TOC entry 4181 (class 0 OID 0)
-- Name: messages_2025_11_05_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_05_pkey";


--
-- TOC entry 4182 (class 0 OID 0)
-- Name: messages_2025_11_06_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_06_inserted_at_topic_idx";


--
-- TOC entry 4183 (class 0 OID 0)
-- Name: messages_2025_11_06_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_06_pkey";


--
-- TOC entry 4184 (class 0 OID 0)
-- Name: messages_2025_11_07_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_inserted_at_topic_index" ATTACH PARTITION "realtime"."messages_2025_11_07_inserted_at_topic_idx";


--
-- TOC entry 4185 (class 0 OID 0)
-- Name: messages_2025_11_07_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX "realtime"."messages_pkey" ATTACH PARTITION "realtime"."messages_2025_11_07_pkey";


--
-- TOC entry 4219 (class 2620 OID 74590)
-- Name: users trigger_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER "trigger_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_users_updated_at"();


--
-- TOC entry 4211 (class 2620 OID 17730)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER "tr_check_filters" BEFORE INSERT OR UPDATE ON "realtime"."subscription" FOR EACH ROW EXECUTE FUNCTION "realtime"."subscription_check_filters"();


--
-- TOC entry 4212 (class 2620 OID 73400)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "enforce_bucket_name_length_trigger" BEFORE INSERT OR UPDATE OF "name" ON "storage"."buckets" FOR EACH ROW EXECUTE FUNCTION "storage"."enforce_bucket_name_length"();


--
-- TOC entry 4213 (class 2620 OID 73431)
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_delete_delete_prefix" AFTER DELETE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- TOC entry 4214 (class 2620 OID 73386)
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_insert_create_prefix" BEFORE INSERT ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."objects_insert_prefix_trigger"();


--
-- TOC entry 4215 (class 2620 OID 73430)
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "objects_update_create_prefix" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW WHEN ((("new"."name" <> "old"."name") OR ("new"."bucket_id" <> "old"."bucket_id"))) EXECUTE FUNCTION "storage"."objects_update_prefix_trigger"();


--
-- TOC entry 4217 (class 2620 OID 73396)
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "prefixes_create_hierarchy" BEFORE INSERT ON "storage"."prefixes" FOR EACH ROW WHEN (("pg_trigger_depth"() < 1)) EXECUTE FUNCTION "storage"."prefixes_insert_trigger"();


--
-- TOC entry 4218 (class 2620 OID 73432)
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "prefixes_delete_hierarchy" AFTER DELETE ON "storage"."prefixes" FOR EACH ROW EXECUTE FUNCTION "storage"."delete_prefix_hierarchy_trigger"();


--
-- TOC entry 4216 (class 2620 OID 17731)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- TOC entry 4186 (class 2606 OID 17732)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4187 (class 2606 OID 17737)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- TOC entry 4188 (class 2606 OID 17742)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE;


--
-- TOC entry 4189 (class 2606 OID 17747)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4205 (class 2606 OID 85781)
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- TOC entry 4206 (class 2606 OID 85786)
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_authorizations"
    ADD CONSTRAINT "oauth_authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4207 (class 2606 OID 85810)
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- TOC entry 4208 (class 2606 OID 85805)
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."oauth_consents"
    ADD CONSTRAINT "oauth_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4190 (class 2606 OID 17752)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4191 (class 2606 OID 17757)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- TOC entry 4192 (class 2606 OID 17762)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- TOC entry 4193 (class 2606 OID 17767)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE;


--
-- TOC entry 4194 (class 2606 OID 17772)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- TOC entry 4195 (class 2606 OID 85824)
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_oauth_client_id_fkey" FOREIGN KEY ("oauth_client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;


--
-- TOC entry 4196 (class 2606 OID 17777)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- TOC entry 4197 (class 2606 OID 17782)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- TOC entry 4209 (class 2606 OID 90499)
-- Name: attendance attendance_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "public"."admin_users"("id");


--
-- TOC entry 4210 (class 2606 OID 90494)
-- Name: attendance attendance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id");


--
-- TOC entry 4204 (class 2606 OID 74576)
-- Name: users fk_users_student_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "fk_users_student_id" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4198 (class 2606 OID 17797)
-- Name: login_logs login_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."login_logs"
    ADD CONSTRAINT "login_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id");


--
-- TOC entry 4199 (class 2606 OID 17802)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4203 (class 2606 OID 73373)
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."prefixes"
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4200 (class 2606 OID 17807)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4201 (class 2606 OID 17812)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- TOC entry 4202 (class 2606 OID 17817)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE CASCADE;


--
-- TOC entry 4370 (class 0 OID 17420)
-- Dependencies: 350
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4371 (class 0 OID 17426)
-- Dependencies: 351
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4372 (class 0 OID 17431)
-- Dependencies: 352
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4373 (class 0 OID 17438)
-- Dependencies: 353
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4374 (class 0 OID 17443)
-- Dependencies: 354
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4375 (class 0 OID 17448)
-- Dependencies: 355
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4376 (class 0 OID 17453)
-- Dependencies: 356
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4377 (class 0 OID 17458)
-- Dependencies: 357
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4378 (class 0 OID 17466)
-- Dependencies: 358
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4379 (class 0 OID 17472)
-- Dependencies: 360
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4380 (class 0 OID 17480)
-- Dependencies: 361
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4381 (class 0 OID 17486)
-- Dependencies: 362
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4382 (class 0 OID 17489)
-- Dependencies: 363
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4383 (class 0 OID 17494)
-- Dependencies: 364
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4384 (class 0 OID 17500)
-- Dependencies: 365
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4385 (class 0 OID 17506)
-- Dependencies: 366
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4404 (class 3256 OID 106555)
-- Name: auto_timeout_logs Allow all operations on auto_timeout_logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all operations on auto_timeout_logs" ON "public"."auto_timeout_logs" USING (true) WITH CHECK (true);


--
-- TOC entry 4403 (class 3256 OID 90315)
-- Name: rfid_logs Allow all operations on rfid_logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all operations on rfid_logs" ON "public"."rfid_logs" USING (true) WITH CHECK (true);


--
-- TOC entry 4401 (class 3256 OID 74627)
-- Name: users Allow anonymous insert to users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous insert to users" ON "public"."users" FOR INSERT TO "anon" WITH CHECK (true);


--
-- TOC entry 4399 (class 3256 OID 74625)
-- Name: students Allow anonymous read access to students; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous read access to students" ON "public"."students" FOR SELECT TO "anon" USING (true);


--
-- TOC entry 4402 (class 3256 OID 74626)
-- Name: users Allow anonymous read access to users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous read access to users" ON "public"."users" FOR SELECT TO "anon" USING (true);


--
-- TOC entry 4400 (class 3256 OID 74628)
-- Name: users Allow anonymous update last_login; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous update last_login" ON "public"."users" FOR UPDATE TO "anon" USING (true) WITH CHECK (true);


--
-- TOC entry 4386 (class 0 OID 17521)
-- Dependencies: 367
-- Name: admin_users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4398 (class 0 OID 106543)
-- Dependencies: 405
-- Name: auto_timeout_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."auto_timeout_logs" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4397 (class 0 OID 90302)
-- Dependencies: 390
-- Name: rfid_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."rfid_logs" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4393 (class 0 OID 17915)
-- Dependencies: 382
-- Name: students; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."students" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4396 (class 0 OID 74562)
-- Dependencies: 387
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4387 (class 0 OID 17547)
-- Dependencies: 371
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE "realtime"."messages" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4388 (class 0 OID 17566)
-- Dependencies: 375
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4395 (class 0 OID 73408)
-- Dependencies: 385
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets_analytics" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4389 (class 0 OID 17575)
-- Dependencies: 376
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4390 (class 0 OID 17579)
-- Dependencies: 377
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4394 (class 0 OID 73363)
-- Dependencies: 384
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."prefixes" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4391 (class 0 OID 17589)
-- Dependencies: 378
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4392 (class 0 OID 17596)
-- Dependencies: 379
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4406 (class 6104 OID 17822)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION "supabase_realtime" WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 4405 (class 6104 OID 90579)
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION "supabase_realtime_messages_publication" WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 4408 (class 6106 OID 100912)
-- Name: supabase_realtime admin_users; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."admin_users";


--
-- TOC entry 4409 (class 6106 OID 100913)
-- Name: supabase_realtime announcements; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."announcements";


--
-- TOC entry 4410 (class 6106 OID 100914)
-- Name: supabase_realtime rfid_logs; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."rfid_logs";


--
-- TOC entry 4407 (class 6106 OID 90580)
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: -
--

ALTER PUBLICATION "supabase_realtime_messages_publication" ADD TABLE ONLY "realtime"."messages";


--
-- TOC entry 3804 (class 3466 OID 17864)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_graphql_placeholder" ON "sql_drop"
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION "extensions"."set_graphql_placeholder"();


--
-- TOC entry 3809 (class 3466 OID 17907)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_cron_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_cron_access"();


--
-- TOC entry 3803 (class 3466 OID 17863)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_graphql_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION "extensions"."grant_pg_graphql_access"();


--
-- TOC entry 3810 (class 3466 OID 17908)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_net_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_net_access"();


--
-- TOC entry 3805 (class 3466 OID 17865)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "pgrst_ddl_watch" ON "ddl_command_end"
   EXECUTE FUNCTION "extensions"."pgrst_ddl_watch"();


--
-- TOC entry 3806 (class 3466 OID 17866)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "pgrst_drop_watch" ON "sql_drop"
   EXECUTE FUNCTION "extensions"."pgrst_drop_watch"();


-- Completed on 2025-11-05 00:05:12

--
-- PostgreSQL database dump complete
--

