// API para conectar React con Supabase PostgreSQL via PHP
// Configurado para usar la estructura real: docente_rut, nombre, email, pass_hash, max_horas_docencia

const API_BASE = 'http://localhost/GestionDocenteUCT/app/tempApi';

class DocentesSupabaseAPI {
    constructor() {
        this.endpoints = {
            docentes: `${API_BASE}/docentes.php`,
            login: `${API_BASE}/login/login.php`,
            test: `${API_BASE}/test.php`
        };
    }

    // Helper para hacer requests
    async request(url, options = {}) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                credentials: 'include', // Para sessions
                ...options
            };

            console.log(`🔗 ${options.method || 'GET'} ${url}`);
            
            const response = await fetch(url, config);
            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.mensaje || 'Error en la API');
            }

            console.log('✅ Respuesta exitosa:', data);
            return data;

        } catch (error) {
            console.error('❌ Error en request:', error);
            throw error;
        }
    }

    // AUTENTICACIÓN con Supabase
    async login(email, password) {
        const data = await this.request(this.endpoints.login, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        console.log('👤 Login exitoso en Supabase:', data.data);
        return data.data;
    }

    // DOCENTES - CRUD completo con PostgreSQL
    async obtenerDocentes(buscar = '', limite = 50, offset = 0) {
        const params = new URLSearchParams({ buscar, limite, offset });
        const url = `${this.endpoints.docentes}?${params}`;
        
        const data = await this.request(url);
        return data.data; // { docentes: [], total: 0, limite: 50, offset: 0 }
    }

    async crearDocente(docente) {
        // Validar campos obligatorios según estructura PostgreSQL
        const camposRequeridos = ['docente_rut', 'nombre', 'email'];
        for (const campo of camposRequeridos) {
            if (!docente[campo]) {
                throw new Error(`Campo requerido: ${campo}`);
            }
        }

        // Validaciones locales
        if (!this.validarRUT(docente.docente_rut)) {
            throw new Error('RUT inválido');
        }

        if (!this.validarEmail(docente.email)) {
            throw new Error('Email inválido');
        }

        console.log('📝 Creando docente en Supabase:', docente);
        
        const data = await this.request(this.endpoints.docentes, {
            method: 'POST',
            body: JSON.stringify(docente)
        });
        
        return data.data;
    }

    async actualizarDocente(rut, cambios) {
        if (!rut) {
            throw new Error('RUT es requerido para actualizar');
        }

        const url = `${this.endpoints.docentes}?rut=${encodeURIComponent(rut)}`;
        
        console.log(`📝 Actualizando docente ${rut} en Supabase:`, cambios);
        
        const data = await this.request(url, {
            method: 'PUT',
            body: JSON.stringify(cambios)
        });
        
        return data;
    }

    async eliminarDocente(rut) {
        if (!rut) {
            throw new Error('RUT es requerido para eliminar');
        }

        if (!confirm(`¿Eliminar docente con RUT ${rut}?`)) {
            return false;
        }

        const url = `${this.endpoints.docentes}?rut=${encodeURIComponent(rut)}`;
        
        console.log(`🗑️ Eliminando docente de Supabase: ${rut}`);
        
        await this.request(url, {
            method: 'DELETE'
        });
        
        return true;
    }

    // UTILIDADES
    async testConexion() {
        try {
            const response = await fetch(this.endpoints.test);
            const isOk = response.ok;
            console.log('🔧 Test de conexión a Supabase:', isOk ? 'OK' : 'Error');
            return isOk;
        } catch (error) {
            console.error('❌ Error en test de Supabase:', error);
            return false;
        }
    }

    // Validaciones locales (compatibles con validaciones del servidor PHP)
    validarRUT(rut) {
        if (!rut) return false;
        
        // Limpiar formato
        const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
        
        if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
        
        const dv = rutLimpio.slice(-1);
        const numero = rutLimpio.slice(0, -1);
        
        // Calcular dígito verificador
        let suma = 0;
        let multiplicador = 2;
        
        for (let i = numero.length - 1; i >= 0; i--) {
            suma += parseInt(numero[i]) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }
        
        const resto = suma % 11;
        const dvCalculado = resto === 0 ? '0' : (resto === 1 ? 'K' : String(11 - resto));
        
        return dv === dvCalculado;
    }

    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    formatearRUT(rut) {
        if (!rut) return '';
        
        const rutLimpio = rut.replace(/[^0-9kK]/g, '');
        if (rutLimpio.length < 8) return rut;
        
        const dv = rutLimpio.slice(-1);
        const numero = rutLimpio.slice(0, -1);
        
        // Formatear con puntos
        return numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
    }

    // Info de configuración
    getConfigInfo() {
        return {
            apiBase: API_BASE,
            endpoints: this.endpoints,
            database: 'Supabase PostgreSQL',
            description: 'API conectada a Supabase con estructura real de docentes'
        };
    }
}

// Hook para React que maneja el estado de los docentes con Supabase
function useDocentesSupabase() {
    const [docentes, setDocentes] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [filtros, setFiltros] = React.useState({
        buscar: '',
        limite: 50,
        offset: 0
    });
    const [totalDocentes, setTotalDocentes] = React.useState(0);

    const api = new DocentesSupabaseAPI();

    const cargarDocentes = async (nuevosFiltros = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            const filtrosActualizados = { ...filtros, ...nuevosFiltros };
            setFiltros(filtrosActualizados);
            
            const resultado = await api.obtenerDocentes(
                filtrosActualizados.buscar,
                filtrosActualizados.limite,
                filtrosActualizados.offset
            );
            
            setDocentes(resultado.docentes || []);
            setTotalDocentes(resultado.total || 0);
            console.log(`📊 Cargados ${resultado.docentes?.length || 0} docentes de ${resultado.total || 0} total`);
            
        } catch (err) {
            setError(err.message);
            console.error('Error cargando docentes desde Supabase:', err);
        } finally {
            setLoading(false);
        }
    };

    const crearDocente = async (docente) => {
        try {
            setError(null);
            await api.crearDocente(docente);
            await cargarDocentes(); // Recargar lista
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const actualizarDocente = async (rut, cambios) => {
        try {
            setError(null);
            await api.actualizarDocente(rut, cambios);
            await cargarDocentes(); // Recargar lista
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const eliminarDocente = async (rut) => {
        try {
            setError(null);
            const eliminado = await api.eliminarDocente(rut);
            if (eliminado) {
                await cargarDocentes(); // Recargar lista
            }
            return eliminado;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const buscarDocentes = (termino) => {
        cargarDocentes({ buscar: termino, offset: 0 });
    };

    const siguientePagina = () => {
        const nuevoOffset = filtros.offset + filtros.limite;
        if (nuevoOffset < totalDocentes) {
            cargarDocentes({ offset: nuevoOffset });
        }
    };

    const paginaAnterior = () => {
        const nuevoOffset = Math.max(0, filtros.offset - filtros.limite);
        cargarDocentes({ offset: nuevoOffset });
    };

    // Cargar al inicio
    React.useEffect(() => {
        cargarDocentes();
    }, []);

    return {
        docentes,
        loading,
        error,
        filtros,
        totalDocentes,
        cargarDocentes,
        crearDocente,
        actualizarDocente,
        eliminarDocente,
        buscarDocentes,
        siguientePagina,
        paginaAnterior,
        api // Exponer API para casos especiales
    };
}

// Exportar para uso en módulos o global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DocentesSupabaseAPI, useDocentesSupabase };
} else {
    window.DocentesSupabaseAPI = DocentesSupabaseAPI;
    window.useDocentesSupabase = useDocentesSupabase;
}

// Ejemplo de uso completo con Supabase
/*
// En tu componente React:
import React, { useState } from 'react';

const DocentesSupabaseManager = () => {
    const { 
        docentes, 
        loading, 
        error, 
        totalDocentes,
        crearDocente, 
        actualizarDocente, 
        eliminarDocente,
        buscarDocentes,
        siguientePagina,
        paginaAnterior,
        filtros,
        api 
    } = useDocentesSupabase();

    const [form, setForm] = useState({
        docente_rut: '',
        nombre: '',
        email: '',
        max_horas_docencia: 40
    });

    const [usuario, setUsuario] = useState(null);

    const handleLogin = async () => {
        try {
            const userData = await api.login('test@uct.cl', '123456');
            setUsuario(userData);
            alert(`Bienvenido ${userData.usuario}`);
        } catch (error) {
            alert('Error en login: ' + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones locales
        if (!api.validarRUT(form.docente_rut)) {
            alert('RUT inválido');
            return;
        }

        if (!api.validarEmail(form.email)) {
            alert('Email inválido');
            return;
        }

        const exito = await crearDocente(form);
        if (exito) {
            setForm({ docente_rut: '', nombre: '', email: '', max_horas_docencia: 40 });
            alert('Docente creado correctamente en Supabase');
        }
    };

    const testConexion = async () => {
        const ok = await api.testConexion();
        alert(ok ? 'Conexión a Supabase OK' : 'Error de conexión a Supabase');
    };

    const paginaActual = Math.floor(filtros.offset / filtros.limite) + 1;
    const totalPaginas = Math.ceil(totalDocentes / filtros.limite);

    return (
        <div style={{ padding: '20px' }}>
            <h1>🚀 Gestión de Docentes - Supabase PostgreSQL</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={testConexion}>🔧 Test Conexión</button>
                <button onClick={handleLogin}>🔐 Login Test</button>
                {usuario && <span style={{ marginLeft: '10px' }}>👤 {usuario.usuario}</span>}
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px' }}>
                <h3>Crear Nuevo Docente</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input 
                        placeholder="RUT (ej: 12.345.678-9)" 
                        value={form.docente_rut}
                        onChange={e => setForm({...form, docente_rut: api.formatearRUT(e.target.value)})}
                        required
                    />
                    <input 
                        placeholder="Nombre completo" 
                        value={form.nombre}
                        onChange={e => setForm({...form, nombre: e.target.value})}
                        required
                    />
                    <input 
                        placeholder="Email" 
                        type="email"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        required
                    />
                    <input 
                        placeholder="Máximo horas docencia" 
                        type="number"
                        min="1"
                        max="50"
                        value={form.max_horas_docencia}
                        onChange={e => setForm({...form, max_horas_docencia: e.target.value})}
                    />
                </div>
                <button type="submit" style={{ marginTop: '10px' }}>Crear Docente</button>
            </form>

            <div style={{ marginBottom: '20px' }}>
                <input 
                    placeholder="🔍 Buscar docentes..." 
                    onChange={e => buscarDocentes(e.target.value)}
                    style={{ width: '300px', padding: '8px' }}
                />
            </div>

            {loading && <p>⏳ Cargando docentes desde Supabase...</p>}
            {error && <p style={{color: 'red'}}>❌ Error: {error}</p>}

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h2>📋 Docentes ({totalDocentes} total)</h2>
                    <div>
                        <button onClick={paginaAnterior} disabled={filtros.offset === 0}>
                            ← Anterior
                        </button>
                        <span style={{ margin: '0 10px' }}>
                            Página {paginaActual} de {totalPaginas}
                        </span>
                        <button onClick={siguientePagina} disabled={filtros.offset + filtros.limite >= totalDocentes}>
                            Siguiente →
                        </button>
                    </div>
                </div>
                
                <div style={{ display: 'grid', gap: '10px' }}>
                    {docentes.map(docente => (
                        <div key={docente.docente_rut} style={{
                            border: '1px solid #ddd', 
                            padding: '15px', 
                            borderRadius: '5px',
                            background: '#f9f9f9'
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                                <div>
                                    <strong>{docente.nombre}</strong><br/>
                                    📧 {docente.email}<br/>
                                    🆔 {docente.docente_rut}
                                </div>
                                <div>
                                    ⏱️ {docente.max_horas_docencia} hrs/semana
                                </div>
                                <button 
                                    onClick={() => eliminarDocente(docente.docente_rut)}
                                    style={{ background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }}
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '20px', padding: '10px', background: '#e8f4fd', borderRadius: '5px' }}>
                <small>
                    🔗 <strong>Configuración:</strong> {JSON.stringify(api.getConfigInfo(), null, 2)}
                </small>
            </div>
        </div>
    );
};

export default DocentesSupabaseManager;
*/