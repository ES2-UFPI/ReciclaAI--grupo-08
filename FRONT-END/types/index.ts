export enum TipoUsuario {
    PRODUTOR = 'produtor',
    COLETOR = 'coletor',
    RECEPTOR = 'receptor',
}

export enum TipoPessoa {
    FISICA = 'fisica',
    JURIDICA = 'juridica',
}

export enum CategoriaResiduo {
    PLASTICO = 'Plástico',
    METAL = 'Metal',
    VIDRO = 'Vidro',
    PAPEL = 'Papel',
    ELETRONICO = 'Eletrônico',
}

export enum UnidadeMedida {
    KG = 'kg',
    LITRO = 'litro',
    UNIDADE = 'unidade',
}

export enum StatusCarga {
    NOVA = 'NOVA',
    PENDENTE_COLETA = 'PENDENTE_COLETA',
    COLETADA = 'COLETADA',
    RECICLADA = 'RECICLADA',
}

export enum StatusColeta {
    PENDENTE = 'PENDENTE',
    AGENDADA = 'AGENDADA',
    COLETADA = 'COLETADA',
    FINALIZADA = 'FINALIZADA',
}

export interface ResiduoAceitoConfig{
    id: number;
    quantidade_minima: number;
    preco_por_unidade: number;
}

export interface Residuo{
    id: number;
    nome: string;
    categoria: CategoriaResiduo;
    descricao: string;
    unidade_medida: UnidadeMedida;
}

export interface UsuarioCreate{
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    endereco: string;
    tipo_usuario: TipoUsuario;
    tipo_pessoa: TipoPessoa;
    cpf?: string;
    cnpj?: string;
 
    // apenas para receptor: nome e formato conforme backend (snake_case)
    residuos_aceitos?: ResiduoAceitoConfig[]; // array de configuração de resíduos aceitos
    horario_funcionamento_inicio?: string; // apenas para receptor Time vem como string "HH:MM:SS"
    horario_funcionamento_fim?: string; // apenas para receptor
    dias_funcionamento?: string[]; // apenas para receptor
}

export interface UsuarioLogin{
    email: string;
    senha: string;
}

export interface UsuarioResponse{
    id: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    latitude: number;
    longitude: number;
    tipo_usuario: TipoUsuario;
    tipo_pessoa: TipoPessoa;
    cpf?: string;
    cnpj?: string;
    nota_media: number;
    pontos: number;

    residuos_aceitos?: ResiduoAceitoConfig[];
    horario_funcionamento_inicio?: string;
    horario_funcionamento_fim?: string;
    dias_funcionamento?: string[];
}

export interface CargaCreate{
    produtor_id: number;
    residuo_id: number;
    quantidade: number;
    descricao?: string;
}

export interface CargaResponse{
    id: number;
    produtor_id: number;
    residuo_id: number;
    quantidade: number;
    data_criacao_carga: string; // Datetime vem como string ISO
    status: StatusCarga;
    codigo: number;
    descricao?: string;
}

export interface ColetaCreate{
    carga_id: number;
    produtor_id: number;
    datahora_janela_inicio: string; // Datetime -> string ISO
    datahora_janela_fim: string;
    observacoes?: string;
}

export interface ColetaResponse {
    id: number;
    carga_id: number;
    produtor_id: number;
    coletor_id?: number;
    nome_coletor?: string;
    receptor_id?: number;
    datahora_janela_inicio: string;
    datahora_janela_fim: string;
    endereco_coleta?: string;
    distancia_km: number;
    status: StatusColeta;
    observacoes?: string;
    data_criacao_coleta: string;
}