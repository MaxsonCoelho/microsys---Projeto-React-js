import React, { useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { AuthContext } from '../../contexts/auth';
import './TableReport.css';


export default function StickyHeadTable({ dataReport }) {
  const { token } = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = [
    { id: 'codigo', label: 'Código', minWidth: 130 },
    { id: 'cor', label: 'Cor', minWidth: 130 },
    { id: 'forma', label: 'Forma', minWidth: 130 },
    { id: 'elevacao', label: 'Elevação', minWidth: 130 },
    { id: 'borda', label: 'Borda', minWidth: 130 },
    { id: 'superficie', label: 'Superfície', minWidth: 130 },
    { id: 'consistencia', label: 'Consistência', minWidth: 130 },
    { id: 'dataColeta', label: 'Data de Coleta', minWidth: 130 },
    { id: 'dataReativacao', label: 'Data de Reativação', minWidth: 130 },
    { id: 'descricaoIsolado', label: 'Desc do Isolado', minWidth: 130 },
    { id: 'detOpticos', label: 'Detalhes ópticos', minWidth: 130 },
    { id: 'identMolecular', label: 'Ident Molecular', minWidth: 130 },
    { id: 'localColeta', label: 'Local de Coleta', minWidth: 130 },
    { id: 'meioIsolamento', label: 'Meio de Isolamento', minWidth: 130 },
    { id: 'pigmento', label: 'Pigmento', minWidth: 130 },
    { id: 'propriedades', label: 'Propriedades', minWidth: 130 },
    { id: 'tempIncubacao', label: 'Tempo de Incubação', minWidth: 130 },
    { id: 'tipoCresc', label: 'Tipo de Crescimento', minWidth: 130 },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataReport
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 25, 100]}
        component="div"
        count={dataReport.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}









