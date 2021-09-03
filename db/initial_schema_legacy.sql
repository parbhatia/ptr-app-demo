create table users (
    id serial primary key,
    email varchar(200) not null,
    password varchar(200) not null,
    unique (email)
);
create table inspection (
    id serial primary key,
    info jsonb NOT NULL,
    pdftainted boolean NOT NULL DEFAULT FALSE,
    time_created TIMESTAMP default now(),
    user_id int not null references users(id) on update cascade on delete cascade
);
create table summary_photos (
    id serial primary key,
    time_created TIMESTAMP DEFAULT NOW(),
    id_array text [] DEFAULT array []::text [],
    caption_array text [] DEFAULT array []::text [],
    cover_photo text default '',
    inspection_id int NOT NULL references inspection(id) on update cascade on delete cascade
);
create table master_store (
    id serial primary key,
    name text NOT NULL,
    time_created timestamp default NOW()
);
create table master_page_store (
    id serial primary key,
    name text NOT NULL,
    time_created timestamp default NOW()
);
create table master_page (
    id serial primary key,
    name text NOT NULL,
    time_created TIMESTAMP DEFAULT NOW(),
    master_page_store_id int not null references master_page_store(id) on update cascade on delete cascade
);
create table master_subsection (
    id serial primary key,
    name text NOT NULL,
    time_created TIMESTAMP DEFAULT NOW(),
    master_page_id int not null,
    FOREIGN KEY(master_page_id) REFERENCES master_page(id) on update cascade on delete cascade
);
create table master_category (
    id serial primary key,
    name text NOT NULL,
    time_created TIMESTAMP DEFAULT NOW(),
    master_subsection_id int not null,
    FOREIGN KEY(master_subsection_id) REFERENCES master_subsection(id) on update cascade on delete cascade
);
create table master_checkbox (
    id serial primary key,
    text text NOT NULL,
    used boolean DEFAULT false,
    time_created TIMESTAMP DEFAULT NOW(),
    master_category_id int not null,
    FOREIGN KEY(master_category_id) REFERENCES master_category(id) on update cascade on delete cascade
);
create table page (
    id serial primary key,
    name text NOT NULL,
    time_created TIMESTAMP DEFAULT NOW(),
    inspection_id int NOT NULL references inspection(id) on update cascade on delete cascade,
    copy_id int
);
create table subsection (
    id serial primary key,
    name text NOT NULL,
    time_created TIMESTAMP DEFAULT NOW(),
    page_id int not null,
    copy_id int,
    FOREIGN KEY(page_id) REFERENCES page(id) on update cascade on delete cascade
);
create table category (
    id serial primary key,
    name text NOT NULL,
    time_created TIMESTAMP DEFAULT NOW(),
    subsection_id int not null,
    copy_id int,
    FOREIGN KEY(subsection_id) REFERENCES subsection(id) on update cascade on delete cascade
);
create table checkbox (
    id serial primary key,
    text text NOT NULL,
    used boolean DEFAULT false,
    time_created TIMESTAMP DEFAULT NOW(),
    category_id int not null,
    copy_id int,
    FOREIGN KEY(category_id) REFERENCES category(id) on update cascade on delete cascade
);
--can have null page_id and master_page_id
create table draggable_category (
    id serial primary key,
    name text NOT NULL,
    time_created TIMESTAMP DEFAULT NOW(),
    page_id int default NULL references page(id) on update cascade on delete cascade,
    master_page_id int default NULL references master_page(id) on update cascade on delete cascade,
    master_store_id int default NULL references master_store(id) on update cascade on delete cascade,
    copy_id int
);
create table draggable_checkbox (
    id serial primary key,
    text text NOT NULL,
    time_created TIMESTAMP DEFAULT NOW(),
    draggable_category_id int not null references draggable_category(id) on update cascade on delete cascade,
    copy_id int
);
create table draggable_subcheckbox (
    id serial primary key,
    text text NOT NULL,
    time_created TIMESTAMP DEFAULT NOW(),
    draggable_checkbox_id int not null references draggable_checkbox(id) on update cascade on delete cascade,
    copy_id int
);
--copy of master_store except it is binded to inspection_id
create table store (
    id serial primary key,
    inspection_id int not null UNIQUE references inspection(id) on update cascade on delete cascade,
    time_created timestamp default NOW()
);
create table store_category (
    id serial primary key,
    name text NOT NULL,
    time_created TIMESTAMP DEFAULT NOW(),
    store_id int not null references store(id) on update cascade on delete cascade,
    copy_id int
);
create table store_checkbox (
    id serial primary key,
    text text NOT NULL,
    used boolean DEFAULT false,
    time_created TIMESTAMP DEFAULT NOW(),
    store_category_id int not null references store_category(id) on update cascade on delete cascade,
    copy_id int
);
create table store_subcheckbox (
    id serial primary key,
    text text NOT NULL,
    used boolean DEFAULT false,
    time_created TIMESTAMP DEFAULT NOW(),
    store_checkbox_id int not null references store_checkbox(id) on update cascade on delete cascade,
    copy_id int
);
create table order_info (
    id serial primary key,
    text text DEFAULT null,
    info int [] DEFAULT array []::int [],
    time_created TIMESTAMP DEFAULT NOW(),
    draggable_category_id int UNIQUE references draggable_category(id) on update cascade on delete cascade,
    draggable_checkbox_id int UNIQUE references draggable_checkbox(id) on update cascade on delete cascade,
    master_page_id int UNIQUE references master_page(id) on update cascade on delete cascade,
    master_subsection_id int UNIQUE references master_subsection(id) on update cascade on delete cascade,
    master_category_id int UNIQUE references master_category(id) on update cascade on delete cascade,
    master_store_id int UNIQUE references master_store(id) on update cascade on delete cascade,
    master_page_store_id int UNIQUE references master_page_store(id) on update cascade on delete cascade
);
--triggers and functions
CREATE FUNCTION master_store_order() RETURNS trigger AS $BODY$ BEGIN
INSERT INTO order_info(master_store_id)
values (NEW.id);
RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;
CREATE FUNCTION master_page_store_order() RETURNS trigger AS $BODY$ BEGIN
INSERT INTO order_info(master_page_store_id)
values (NEW.id);
RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;
CREATE TRIGGER create_master_store_order
AFTER
INSERT ON master_store FOR EACH ROW EXECUTE PROCEDURE master_store_order();
CREATE TRIGGER create_master_page_store_order
AFTER
INSERT ON master_page_store FOR EACH ROW EXECUTE PROCEDURE master_page_store_order();
-- CREATE TRIGGER new_inspection_trigger
-- AFTER
-- INSERT ON inspection FOR EACH ROW EXECUTE PROCEDURE copy_all_master_info();