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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from "html-to-pdfmake"

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
    detOpticos: item.detOpticos,
    urlImagem: item.urlImagem,
    pigmento: item.pigmento,
    propriedades: item.propriedades,
    meioIsolamento: item.meioIsolamento,
    tempIncubacao: item.tempIncubacao,
    descricaoIsolado: item.descricaoIsolado,
    dataColeta: item.dataColeta,
    dataReativacao: item.dataReativacao,
    esporula: item.esporula,
    localColeta: item.localColeta,
    morfologia: itemMorph[0].descricao,
    hospedeiro: itemHost[0].descricao,
    morfologiaId: itemMorph[0].id,
    hospedeiroId: itemHost[0].id,
    itemId: item.id,
    buttonUpdate: buttonUpdate
    });

  }

  async function generateImage(item){
    try{
      let image;
      let response = await api.get(`/files/image?urlImage=${item.urlImagem}`, 
      { 
          responseType: 'arraybuffer',
          headers:{
              'Content-type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': '*/*'
          }  
      });
      const result = response.data;
      image = Buffer.from(result, 'binary').toString('base64');
      const formatImage = image ? ('data:image/;base64, ' + image) : undefined;
      clientePDF(item, formatImage)
    }
    catch(error){
        alert('Ocorreu um erro na exibição de imagens');
        console.log(error);
    }
  }

  function clientePDF(item, formatImage){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const reportTitle = [
      {
        text: 'Centro de Biotécnologia da Amazônia',
        fontSize: 20,
        bold: true,
        margin: [135, 20, 0, 30] // left, top, right, bottom
      }
    ];
    const html = htmlToPdfmake(
      ` <h5>Microorganismo Bacteriano</h5>
      <p>Foto 1</p><img src="${formatImage}" width="70" />
      <p>Detalhes</p>
      <table width="100%" border="1"  cellpadding="0" cellspacing="0">
      <tr>
         <td width="11%" >
            <table><font  size="1">
                 <tr><td><strong>Código: ${item.codigo}</strong></td></tr>
                 <tr><td><strong>Identificação Molecular: ${item.identMolecular == undefined ? 'Não especificado' : item.identMolecular}</strong></td></tr>
                 <tr><td><strong>Cor: ${item.cor == undefined ? 'Não especificado' : item.cor}</strong></td></tr>
                 <tr><td><strong>Forma: ${item.forma  == undefined ? 'Não especificado' : item.forma}</strong></td></tr>
                 <tr><td><strong>Elevação: ${item.elevacao == undefined ? 'Não especificado' : item.elevacao}</strong></td></tr>
                 <tr><td><strong>Tipo de Crescimento: ${item.tipoCresc == undefined ? 'Não especificado' : item.tipoCresc}</strong></td></tr>
                 <tr><td><strong>Borda: ${item.borda == undefined ? 'Não especificado' : item.borda}</strong></td></tr>
                 <tr><td><strong>Esporula: ${item.esporula == undefined ? 'Não especificado' : item.esporula}</strong></td></tr>
                 <tr><td><strong>Superfície: ${item.superficie == undefined ? 'Não especificado' : item.superficie}</strong></td></tr>
                 <tr><td><strong>Consistência: ${item.consistencia == undefined ? 'Não especificado' : item.consistencia}</strong></td></tr>
                 <tr><td><strong>Detalhes Ópticos: ${item.detOpticos == undefined ? 'Não especificado' : item.detOpticos}</strong></td></tr>
                 <tr><td><strong>Pigmento: ${item.pigmento == undefined ? 'Não especificado' : item.pigmento}</strong></td></tr>
                 <tr><td><strong>Propriedades: ${item.propriedades == undefined ? 'Não especificado' : item.propriedades}</strong></td></tr>
                 <tr><td><strong>Meio de Isolamento: ${item.meioIsolamento == undefined ? 'Não especificado' : item.meioIsolamento}</strong></td></tr>
                 <tr><td><strong>Tempo de Incubação: ${item.tempIncubacao == undefined ? 'Não especificado' : item.tempIncubacao}</strong></td></tr>
                 <tr><td><strong>Descrição do Isolado: ${item.descricaoIsolado == undefined ? 'Não especificado' : item.descricaoIsolado}</strong></td></tr>
                 <tr><td><strong>Data de Coleta: ${item.dataColeta == undefined ? 'Não especificado' : item.dataColeta}</strong></td></tr>
                 <tr><td><strong>Local de Coleta: ${item.localColeta == undefined ? 'Não especificado' : item.localColeta}</strong></td></tr>
                 <tr><td><strong>Data de Reativação: ${item.dataReativacao == undefined ? 'Não especificado' : item.dataReativacao}</strong></td></tr>
                 </tr></font>
             </table>
        </td>
      </tr>
   </table>
   `
    )
    function rodape(currentPage, pageCount){
      return [
        {
          text: currentPage + ' / ' + pageCount,
          alignment: 'right',
          fontSize: 16,
          bold: true,
          margin: [0, 10, 20, 0] // left, top, right, bottom
        }
      ]
    }
    const docDefinitions = {
      pageSize: 'A4',
      pageMargins: [15, 50, 15, 40],
      header: [reportTitle],
      content: [html],
      footer: rodape
    }

    pdfMake.createPdf(docDefinitions).download();
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
                        <PictureAsPdfIcon id="icon" onClick={()=> generateImage(row)} />
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









