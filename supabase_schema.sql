-- Criar tabela de clientes e fornecedores
create table cadastros (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  tipo text not null check (tipo in ('cliente', 'fornecedor')),
  cpf_cnpj text,
  telefone text,
  email text,
  cidade text default 'Montes Claros',
  status text default 'ativo' check (status in ('ativo', 'inativo')),
  observacoes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de contas a pagar
create table contas_pagar (
  id uuid default gen_random_uuid() primary key,
  descricao text not null,
  valor numeric not null,
  vencimento date not null,
  categoria text,
  fornecedor text, -- Pode ser FK futuramente para a tabela cadastros
  status text default 'pendente' check (status in ('pendente', 'pago', 'vencido')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de contas a receber
create table contas_receber (
  id uuid default gen_random_uuid() primary key,
  descricao text not null,
  valor numeric not null,
  vencimento date not null,
  cliente text, -- Pode ser FK futuramente
  status text default 'pendente' check (status in ('pendente', 'recebido', 'atrasado')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de faturamento (organizado por mês, ano e unidade)
create table faturamento (
  id uuid default gen_random_uuid() primary key,
  unidade text not null check (unidade in ('novo-horizonte', 'coimbra', 'canaa')),
  ano integer not null,
  mes text not null check (mes in ('Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez')),
  valor numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (unidade, ano, mes) -- Evita duplicatas do mesmo mês para a cursa unidade
);

-- Policies (RLS) - Permite tudo para uso público inicialmente (para facilitar o dev sem auth)
alter table cadastros enable row level security;
create policy "Allow all CRUD for cadastros" on cadastros for all using (true) with check (true);

alter table contas_pagar enable row level security;
create policy "Allow all CRUD for contas_pagar" on contas_pagar for all using (true) with check (true);

alter table contas_receber enable row level security;
create policy "Allow all CRUD for contas_receber" on contas_receber for all using (true) with check (true);

alter table faturamento enable row level security;
create policy "Allow all CRUD for faturamento" on faturamento for all using (true) with check (true);
