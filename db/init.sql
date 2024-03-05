-- public.wallet_tracking definition

-- Drop table

-- DROP TABLE public.wallet_tracking;

CREATE TABLE public.wallet_tracking (
	address varchar NOT NULL,
	trace_id varchar NOT NULL,
	created_at timestamp NULL,
	id serial4 NOT NULL,
	chain_id int4 NOT NULL,
	CONSTRAINT wallet_tracking_pk PRIMARY KEY (id)
);