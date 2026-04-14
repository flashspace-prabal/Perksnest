alter table if exists perksnest.ticket_messages
  add column if not exists sender_id uuid,
  add column if not exists sender_type text;

update perksnest.ticket_messages
set
  sender_id = coalesce(sender_id, user_id),
  sender_type = coalesce(
    sender_type,
    case
      when is_admin = true then 'admin'
      else 'user'
    end
  )
where sender_id is null or sender_type is null;

alter table if exists perksnest.ticket_messages
  alter column sender_id set not null,
  alter column sender_type set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ticket_messages_sender_type_check'
  ) then
    alter table perksnest.ticket_messages
      add constraint ticket_messages_sender_type_check
      check (sender_type in ('user', 'admin'));
  end if;
end $$;

create index if not exists idx_ticket_messages_ticket_id_created_at
  on perksnest.ticket_messages (ticket_id, created_at);

create index if not exists idx_ticket_messages_sender_id
  on perksnest.ticket_messages (sender_id);
