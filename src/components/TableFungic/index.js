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
import './TableFungic.css';
import { AuthContext } from '../../contexts/auth';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from "html-to-pdfmake"

export default function StickyHeadTable({ dataFungic, getFungic }) {
  let history = useHistory();
  const { token } = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [buttonUpdate, setButtonUpdate] = useState(true);
  const [formatImagehtml1, setFormatImageHtml1] = useState();
  const [formatImagehtml2, setFormatImageHtml2] = useState();
  const [formatImagehtml3, setFormatImageHtml3] = useState();
  

  const columns = [
    { id: 'codigo', label: 'Código', minWidth: 130 },
    { id: 'descricaoIsolado', label: 'Descrição', minWidth: 130 },
    { id: 'cor', label: 'Cor', minWidth: 130 },
    { id: 'propriedades', label: 'Propriedades', minWidth: 130 },
    { id: 'forma', label: 'Forma', minWidth: 130 },
    { id: 'textura', label: 'Textura', minWidth: 130 },
    
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const directionEdit = async (item, itemMorph, itemHost)=> {
    
    history.push({pathname: 'adicao-fungica', 
    codigo: item.codigo,
    identMolecular: item.identMolecular,
    cor: item.cor,
    corVerso: item.corVerso,
    pigmento: item.pigmento,
    textura: item.textura,
    forma: item.forma,
    borda: item.borda,
    superficie: item.superficie, 
    elevacao: item.elevacao,
    esporula: item.esporula,
    tipoCresc: item.tipoCresc,
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
    urlImagem: item.urlImagem,
    urlImagemVerso: item.urlImagemVerso,
    urlImagemMicro: item.urlImagemMicro,
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
    const res = window.confirm('Sabia que além de remover, você pode desativar ou ativar um registro, deseja mesmo remover este usuário ?');
      if(res === true){

        try{
          await api.delete(`/fungos/${item.id}`,  {
            data: {foo: 'bar'}
          })
          alert('Registro excluído com sucesso!');
          getFungic();
        }
        catch(error){
          console.log(error)
          alert('Erro ao tentar excluir este registro.');
        }
        return
      }
  }

  async function generateImage(item){
    try{
      if(item.urlImagem != null){
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
        setFormatImageHtml1(formatImage);
      }
      
      if(item.urlImagemVerso != null){
        let image2;
        let response2 = await api.get(`/files/image?urlImage=${item.urlImagemVerso}`, 
        { 
            responseType: 'arraybuffer',
            headers:{
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
            }  
        });
        const result2 = response2.data;
        image2 = Buffer.from(result2, 'binary').toString('base64');
        const formatImage2 = image2 ? ('data:image/;base64, ' + image2) : undefined;
        setFormatImageHtml2(formatImage2);
      }
      
      if(item.urlImagemMicro != null){
        let image3;
        let response3 = await api.get(`/files/image?urlImage=${item.urlImagemMicro}`, 
        { 
            responseType: 'arraybuffer',
            headers:{
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
            }  
        });
        const result3 = response3.data;
        image3 = Buffer.from(result3, 'binary').toString('base64');
        const formatImage3 = image3 ? ('data:image/;base64, ' + image3) : undefined;
        setFormatImageHtml3(formatImage3);
      }

      clientePDF(item, formatImagehtml1, formatImagehtml2, formatImagehtml3);
    }
    catch(error){
        alert('Ocorreu um erro na exibição de imagens');
        console.log(error);
    }
  }

  function clientePDF(item, formatImage, formatImage2, formatImage3){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const reportTitle = [
      {
        text: 'Centro de Biotécnologia da Amazônia',
        fontSize: 20,
        bold: true,
        margin: [135, 20, 0, 30] // left, top, right, bottom
      }
    ];
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
    const html = htmlToPdfmake(
      ` <h5>Microorganismo Fúngico</h5>
      <p>Foto 1</p><img src="${formatImage}" width="70" height="70"/><p>Foto 2</p><img src="${formatImage2}" width="70" height="70"/><p>Foto 3</p><img src="${formatImage3}" width="70" height="70"/>
      <p>Detalhes</p>
      <table width="100%" border="1"  cellpadding="0" cellspacing="0">
      <tr>
         <td width="11%" >
            <table><font  size="1">
                 <tr><td><strong>Código: ${item.codigo}</strong></td></tr>
                 <tr><td><strong>Identificação Molecular: ${item.identMolecular == undefined ? 'Não especificado' : item.identMolecular}</strong></td></tr>
                 <tr><td><strong>Cor: ${item.cor == undefined ? 'Não especificado' : item.cor}</strong></td></tr>
                 <tr><td><strong>Cor Verso: ${item.corVerso == undefined ? 'Não especificado' : item.corVerso}</strong></td></tr>
                 <tr><td><strong>Forma: ${item.forma  == undefined ? 'Não especificado' : item.forma}</strong></td></tr>
                 <tr><td><strong>Elevação: ${item.elevacao == undefined ? 'Não especificado' : item.elevacao}</strong></td></tr>
                 <tr><td><strong>Tipo de Crescimento: ${item.tipoCresc == undefined ? 'Não especificado' : item.tipoCresc}</strong></td></tr>
                 <tr><td><strong>Borda: ${item.textura == undefined ? 'Não especificado' : item.textura}</strong></td></tr>
                 <tr><td><strong>Textura: ${item.borda == undefined ? 'Não especificado' : item.borda}</strong></td></tr>
                 <tr><td><strong>Esporula: ${item.esporula == undefined ? 'Não especificado' : item.esporula}</strong></td></tr>
                 <tr><td><strong>Superfície: ${item.superficie == undefined ? 'Não especificado' : item.superficie}</strong></td></tr>
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
    const docDefinitions = {
      pageSize: 'A4',
      pageMargins: [15, 50, 15, 40],
      header: [reportTitle],
      content: [html],
      footer: rodape
    }

    pdfMake.createPdf(docDefinitions).download();
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
            {dataFungic
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
        count={dataFungic.length}
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