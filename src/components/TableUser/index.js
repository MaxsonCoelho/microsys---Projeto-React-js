import React, { useContext } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { AuthContext } from '../../contexts/auth';
import './table.css'


export default function StickyHeadTable({ setButtonMobileVisible, objInputs, removeUser }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { dataListUsers } = useContext(AuthContext);

  const columns = [
    { id: 'name', label: 'Name', minWidth: 130 },
    { id: 'email', label: 'E-mail', minWidth: 130 },
    
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const directionEdit = async (item)=> {
    setButtonMobileVisible(true);
    objInputs.name(item.name);
    objInputs.email(item.email);
    objInputs.master(item.master);
    objInputs.active(item.active);
    objInputs.id(item.id);
  }

  const directionRemove = async (item) => {
    const res = window.confirm('Sabia que além de remover, você pode desativar ou ativar um registro, deseja mesmo remover este usuário ?');
      if(res === true){
        await objInputs.id(item.id);
        removeUser(item);
        return
      }
  }

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
            {dataListUsers
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
                      <div className='areaActions'>
                        <EditIcon id="icon" onClick={()=> directionEdit(row)} />
                        <DeleteForeverIcon id="icon" onClick={()=> directionRemove(row)} />
                      </div>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={dataListUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}




















// import * as React from 'react';
// import './table.css';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


// export default function DataTable() {
//   return (
//     <div className='container'>
//       <div className='areaFormulary2'>
//             <div id='textUser'>
//                 <span>Lista de microorganismos fúngicos:</span>
//             </div>
//             <div className='listHeader'>
//                 <span id="idEmail">Descrição</span>
//                 <span id="idEmail">Cor</span>
//                 <span id="idEmail">Propriedades</span>
//                 <span id="idEmail">Forma</span>
//                 <span id="idEmail">Tipo</span>
//             </div>
//             <div className='listUser'>
//                 {
//                 data.map(m => (
//                     <div className='containerUser'>
//                     {loading ?
//                         <ProgressBar />
//                         :
//                         <>
//                         <div className='listUsers'>
//                             <span>{m.name}</span>
//                         </div>
//                         <div className='listUsers'>
//                             <span>{m.email}</span>
//                         </div>
//                         </>
//                     }
//                     <div className='options'>
//                         <EditIcon id="icon"/>
//                         <DeleteForeverIcon id="icon"/>
//                     </div>
//                     </div>
//                 ))
//                 }
//             </div>
            
//         </div>
//     </div>
//   );
// }