import React, { useState, useEffect, useContext } from 'react';
import './report.css';
import Header from '../../components/Header';
import TableReport from '../../components/TableReport';
import Button from '@mui/material/Button';
import api from '../../services/api';
import { AuthContext } from '../../contexts/auth';
import CircularIndeterminate from '../../components/CircularProgress';
import PrintIcon from '@mui/icons-material/Print';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from "html-to-pdfmake"


export default function Report() {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('RELATÓRIOS');
  const [visible, setVisible] = useState(true);
  const [offSearch, setOffSearch] = useState(false);
  const [dataBactery, setDataBactery] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [valueSelection, setValueSelection] = useState('');
  const [identMolecular, setIdentMolecular] = useState('');
  const [pigment, setPigment] = useState('');
  const [color, setColor] = useState('');
  const [property, setProperty] = useState('');
  const [dataReport, setDataReport] = useState([]);

  async function searchReport() {

    if(valueSelection) {
      const response = await api.get(`/reports/${valueSelection}?identMolecular=${identMolecular}&cor=${color}&pigmento=${pigment}&propriedades=${property}`)
      const res = response.data;
      setDataReport(res);
      console.log(res);
    } else {
      alert('Selecione Bactérias ou Fungos para criar um relatório.');
    }
  }

  function clientePDF(item){
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

  useEffect(()=> {
    
  }, [])

  return (
    <div className="containerAll">
      <Header title={title} visible={visible} offSearch={offSearch} />
      <div className="areaSearch">
        <div className='smallAreaSelection'>
            <span>Selecione o tipo de relatório:</span>
            <select value={valueSelection} name="selection" id="input" onChange={e=> setValueSelection(e.target.value)}>
                <option value="">Selecione</option>
                <option value='bacterias'>Bactérias</option>
                <option value='fungos'>Fungos</option>
            </select>
        </div>
          <div style={{flexDirection: 'column', width: 150, marginRight: 10}}>
            <span>Ident Molecular:</span>
            <input type="text" placeholder="digite" placeholderTextColor="#ccc" id="inputSearch" onChange={e=> setIdentMolecular(e.target.value)}/>
          </div>
          <div style={{flexDirection: 'column', width: 150, marginRight: 10}}>
            <span>Pigmento:</span>
            <input type="text" placeholder="digite" placeholderTextColor="#ccc" id="inputSearch" onChange={e=> setPigment(e.target.value)}/>
          </div>
          <div style={{flexDirection: 'column', width: 150, marginRight: 10}}>
            <span>Cor:</span>
            <input type="text" placeholder="digite" placeholderTextColor="#ccc" id="inputSearch" onChange={e=> setColor(e.target.value)}/>
          </div>
          <div style={{flexDirection: 'column', width: 150, marginRight: 10}}>
            <span>Propriedade:</span>
            <input type="text" placeholder="digite" placeholderTextColor="#ccc" id="inputSearch" onChange={e=> setProperty(e.target.value)}/>
          </div>
      </div>
      <div style={{alignSelf: 'center', marginTop: 10}}>
        <Button variant="contained">
          <ManageSearchIcon onClick={searchReport} />
        </Button>
      </div>
      <div className='containerTableBacteryReport'>
      {loading ?
        <CircularIndeterminate />
        :
        <TableReport dataReport={dataReport} />
      }
      </div>
      <div style={{alignSelf: 'center', marginTop: 10}} className='areaButton'>
        <Button variant="contained"> 
          <PrintIcon onClick={clientePDF}  />
        </Button>
      </div>
    </div>
  )
}
 