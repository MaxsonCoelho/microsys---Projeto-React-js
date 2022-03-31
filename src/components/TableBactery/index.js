import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AuthContext } from '../../contexts/auth';
import './TableBactery.css';

export default function StickyHeadTable({ dataBactery, getBactery }) {
  let history = useHistory();
  const { token } = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [buttonUpdate, setButtonUpdate] = useState(true);
  

  const columns = [
    { id: 'codigo', label: 'Código', minWidth: 130 },
    { id: 'cor', label: 'Cor', minWidth: 130 },
    { id: 'forma', label: 'Forma', minWidth: 130 },
    { id: 'elevacao', label: 'Elevação', minWidth: 130 },
    { id: 'borda', label: 'Borda', minWidth: 130 },
    { id: 'superficie', label: 'Superfície', minWidth: 130 }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const directionEdit = async (item, itemMorph, itemHost)=> {
    
    history.push({pathname: 'adicao-bacteriana/', 
    codigo: item.codigo,
    identMolecular: item.identMolecular,
    cor: item.cor,
    forma: item.forma,
    elevacao: item.elevacao,
    borda: item.borda,
    superficie: item.superficie, 
    consistencia: item.consistencia,
    detalhes: item.detalhes,
    pigmentos: item.pigmentos,
    propriedades: item.propriedades,
    meioIsolamento: item.meioIsolamento,
    tempIncubacao: item.tempIncubacao,
    descricaoIsolado: item.descricaoIsolado,
    dataColeta: item.dataColeta,
    dataReativacao: item.dataReativacao,
    localColeta: item.localColeta,
    morfologia: itemMorph[0].descricao,
    hospedeiro: itemHost[0].descricao,
    morfologiaId: itemMorph[0].id,
    hospedeiroId: itemHost[0].id,
    itemId: item.id,
    buttonUpdate: buttonUpdate
    });

  }

  const GeneratorPdf = async (item)=> {
    console.log('qui')
    history.push({pathname: 'pdf-generator/', 
    codigo: item.codigo,
    identMolecular: item.identMolecular,
    cor: item.cor,
    forma: item.forma,
    elevacao: item.elevacao,
    borda: item.borda,
    superficie: item.superficie, 
    consistencia: item.consistencia,
    detalhes: item.detalhes,
    pigmentos: item.pigmentos,
    propriedades: item.propriedades,
    meioIsolamento: item.meioIsolamento,
    tempIncubacao: item.tempIncubacao,
    descricaoIsolado: item.descricaoIsolado,
    dataColeta: item.dataColeta,
    dataReativacao: item.dataReativacao,
    localColeta: item.localColeta,
    morfologiaId: item.morfologiaId,
    hospedeiroId: item.hospedeiroId,
    itemId: item.id,
    buttonUpdate: buttonUpdate
    });

  }

  async function getMorphological(item){
    try{
        let responseMorph = await api.get('/morfologias',{
          headers:{
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*'
          }
        })
        const resultMorph = responseMorph.data;
        const itemMorph = resultMorph.filter(i => {
          return i.id === item.morfologiaId ;
      })

      const responseHost = await api.get('/hospedeiros',{
        headers:{
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      })
        const resultHost = responseHost.data;
        const itemHost = resultHost.filter(i => {
            return i.id === item.hospedeiroId;
        });

      directionEdit(item, itemMorph, itemHost);
    }
    catch(error){
        console.log('erro na listagem:', error);
    }
    
  }

  const directionRemove = async (item) => {
    const res = window.confirm('Tem certeza de que deseja remover este registro ?');
      if(res === true){

        try{
          await api.delete(`/bacterias/${item.id}`,  {
            data: {foo: 'bar'}
          })
          alert('Registro excluído com sucesso!');
          getBactery();
        }
        catch(error){
          console.log(error)
          alert('Erro ao tentar excluir este registro.');
        }
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
            {dataBactery
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
                      <VisibilityIcon id="icon" onClick={()=> getMorphological(row)} />
                        <PictureAsPdfIcon id="icon" onClick={()=> GeneratorPdf(row)} />
                        <EditIcon id="icon" onClick={()=> getMorphological(row)} />
                        <DeleteForeverIcon id="icon" onClick={()=> directionRemove(row)} />
                      </div>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 25, 100]}
        component="div"
        count={dataBactery.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}









