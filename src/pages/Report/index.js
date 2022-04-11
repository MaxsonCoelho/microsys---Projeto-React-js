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


  function clientePDF(dataReport){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    if(valueSelection == 'bacterias'){
      const reportTitle = [
        {
          text: 'Centro de Biotécnologia da Amazônia',
          fontSize: 20,
          bold: true,
          margin: [250, 20, 0, 60] // left, top, right, bottom
        }
      ];
  
      const data = dataReport.map((item) => {
        return [item.codigo, item.cor, item.forma, item.elevacao, item.borda, item.superficie, item.consistencia, item.dataColeta, item.dataReativacao, item.identMolecular, item.localColeta, item.pigmento, item.propriedades, item.tempIncubacao]
      })

      const title = {text: 'MICROORGANISMOS BACTERIANOS', style: 'header', }
      
      const html = {
        style: 'tableExample',
        fontSize: 10,
        table: {
          body: [
            ['Código', 'Cor', 'Forma', 'Elevação', 'Borda', 'Superfície', 'Consistência', 'Data de Coleta', 'Data de Reativação', 'Ident Molecular', 'Local de Coleta', 'Pigmento', 'Propriedades', 'Tempo de Incubação'],
            ...data
          ]
        }
      }
      
      function rodape(currentPage, pageCount){
        return [
          {
            text: currentPage + ' / ' + pageCount,
            alignment: 'right',
            fontSize: 14,
            bold: true,
            margin: [0, 10, 20, 0] // left, top, right, bottom
          }
        ]
      }
      const docDefinitions = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [15, 50, 15, 40],
        header: [reportTitle],
        content: [title, html],
        footer: rodape
      }
  
      pdfMake.createPdf(docDefinitions).download();
    }else {
      const reportTitle = [
        {
          text: 'Centro de Biotecnologia da Amazônia',
          fontSize: 20,
          bold: true,
          margin: [250, 20, 0, 40] // left, top, right, bottom
        }
      ];
  
      const data = dataReport.map((item) => {
        return [item.codigo, item.cor, item.forma, item.elevacao, item.borda, item.superficie, item.dataColeta, item.dataReativacao, item.descricaoIsolado, item.identMolecular, item.localColeta, item.pigmento, item.propriedades, item.tempIncubacao]
      })

      const title = {text: 'MICROORGANISMOS FÚNGICOS', style: 'header', }
      
      const html = {
        style: 'tableExample',
        fontSize: 10,
        table: {
          body: [
            ['Código', 'Cor', 'Forma', 'Elevação', 'Borda', 'Superfície', 'Data de Coleta', 'Data de Reativação', 'Desc do Isolado', 'Ident Molecular', 'Local de Coleta', 'Pigmento', 'Propriedades', 'Tempo de Incubação'],
            ...data
          ]
        }
      }
      
      function rodape(currentPage, pageCount){
        return [
          {
            text: currentPage + ' / ' + pageCount,
            alignment: 'right',
            fontSize: 14,
            bold: true,
            margin: [0, 10, 20, 0] // left, top, right, bottom
          }
        ]
      }
      const docDefinitions = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [15, 50, 15, 40],
        header: [reportTitle],
        content: [title, html],
        footer: rodape
      }
  
      pdfMake.createPdf(docDefinitions).download();
    }
  }
  

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
          <PrintIcon onClick={()=> clientePDF(dataReport)}  />
        </Button>
      </div>
    </div>
  )
}
 