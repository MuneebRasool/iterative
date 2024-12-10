const SOCKET_IO_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}`;
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/`;
const CONVERTER_URL = `${process.env.NEXT_PUBLIC_CONVERTER_BASE_URL || 'http://localhost:3001'}`;

export { API_BASE_URL, SOCKET_IO_URL, CONVERTER_URL };
