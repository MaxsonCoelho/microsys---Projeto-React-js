import React, { useEffect, useState, useContext } from 'react';
import './addBactery.css';
import { useHistory } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Header from '../../components/Header';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import api from '../../services/api';
import { AuthContext } from '../../contexts/auth';
import { FiUpload, FiXCircle } from 'react-icons/fi';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { MicroContext } from '../../contexts/microorganismos';
import CircularIndeterminate from '../../components/CircularProgress';


export default function AddBactery(props){
    let history = useHistory();
    const { token } = useContext(AuthContext);
    const { activeDeletePhotos } = useContext(MicroContext);
    const [title, setTitle] = useState('CADASTRAR COLÔNIA BACTERIANA');
    const [visible, setVisible] = useState(false);
    const [offSearch, setOffSearch] = useState(false);
    const [dataMorphological, setDataMorphological] = useState([]);
    const [dataHost, setDataHost] = useState([]);
    const [filePhoto, setFilePhoto] = useState();
    const [filePhotoVerso, setFilePhotoVerso] = useState();
    const [filePhotoMicro, setFilePhotoMicro] = useState();
    const [imageUrl, setImageUrl] = useState(null);
    const [imageVersoUrl, setImageVersoUrl] = useState(null);
    const [imageMicroUrl, setImageMicroUrl] = useState(null);
    const [description, setDescription] = useState('');
    const [collectionPlace, setCollectionPlace] = useState('');
    const [border, setBorder] = useState('');
    const [surface, setSurface] = useState('');
    const [properties, setProperties] = useState('');
    const [molecularIdentification, setMolecularIdentification] = useState('');
    const [typeGrowth, setTypeGrowth] = useState('');
    const [color, setColor] = useState('');
    const [consistence, setConsistence] = useState('');
    const [detOpticos, setDetOpticos] = useState('');
    const [form, setForm] = useState('');
    const [elevation, setElevation] = useState('');
    const [dateCollect, setDateCollect] = useState('');
    const [dateReactvation, setDateReactvation] = useState('');
    const [spore, setSpore] = useState();
    const [morphological, setMorphological] = useState('');
    const [host, setHost] = useState('');
    const [isolationMedium, setIsolationMedium] = useState('');
    const [startIncubation, setStartIncubation] = useState(Number);
    const [code, setCode] = useState('');
    const [pigment, setPigment] = useState('');
    const [addMorph, setAddMoph] = useState('');
    const [addNewHost, setAddNewHost] = useState('');
    const [openAddMorph, setOpenAddMorph] = useState(false);
    const [openHost, setOpenHost] = useState(false);
    const [idMorph, setIdMorph] = useState();
    const [idHost, setIdHost] = useState();
    const [idBactery, setIdBactery] = useState('');
    const [passValidation, setPassValidation] = useState(false);
    const [updateTitle, setUpdateTitle] = useState('ATUALIZAR');

    function addMorphological(){
        setOpenAddMorph(true);
    }

    function addHost(){
        setOpenHost(true);
    }

    async function addMorphRequest(){
        if(addMorph === ''){
            alert('Preencha o campo de identificação Morfológica');
            return
        }

        try{
            await api.post('/morfologias',{
                descricao: addMorph
            })
            
            alert('Cadastro realizado com sucesso!');
            setOpenAddMorph(false);
            getMorphological();
            setAddMoph('');
        }
        catch(error){
            console.log(error);
            alert('Essa identificação morfológica já exite!');
        }       

    }

    async function addHostRequest(){
        if(addNewHost === ''){
            alert('Preencha o campo de origem do hospedeiro');
            return
        }

        try{
            await api.post('/hospedeiros',{
                descricao: addNewHost
            })
            
            alert('Cadastro realizado com sucesso!');
            setOpenHost(false);
            getHost();
            setAddNewHost('');
        }
        catch(error){
            console.log(error);
            alert('Essa identificação morfológica já exite!');
        } 
    }

    function validationFormBactery(body){
        const arrayBody = Object.entries(body);
        const propEmpty = arrayBody.filter(e => {
            return e[1] === '';
        })

        if(propEmpty.length > 0){
            const arrayPropEmpty = propEmpty.map(item => {
                return item[0];
            })

            const formatedString = arrayPropEmpty.join(', ').toString();
            console.log(formatedString)
            alert(`Preencha os seguintes campos ${formatedString}`);
            setPassValidation(true);
        }
        
    }

    async function addBactery(){
        setPassValidation(false);
        
        if(imageUrl === undefined){
            return alert('Adicione pelo menos uma imagem para continuar o registro deste microorganismo.');
        }

        if(host === ''){
            return alert('Escolha uma Origem para o hospedeiro.');
        }

        const body = {
            codigo: code,
            identMolecular: molecularIdentification,
            cor: color,
            pigmento: pigment,
            consistencia: consistence,
            detOpticos: detOpticos,
            forma: form,
            borda: border,
            superficie: surface, 
            elevacao: elevation,
            esporula: spore,
            tipoCresc: typeGrowth,
            propriedades: properties,
            meioIsolamento: isolationMedium,
            tempIncubacao: startIncubation,
            descricaoIsolado: description,
            dataColeta: dateCollect,
            dataReativacao: dateReactvation,
            localColeta: collectionPlace,
            morfologiaId: idMorph[0].id,
            hospedeiroId: idHost[0].id
        }

        if(!passValidation){
            validationFormBactery(body);
        }else {
            return
        }
        
        try{

            api.defaults.headers.common.Authorization = 'Bearer ' + token;
            let response = await api.post('/bacterias', body);

            const result = response.data;
            const id = result.id;
            setDescription('');
            setCollectionPlace('');
            setBorder('');
            setSurface('');
            setProperties('');
            setMolecularIdentification('');
            setTypeGrowth('');
            setColor('');
            setForm('');
            setElevation('');
            setDateCollect('');
            setConsistence('');
            setDetOpticos('');
            setDateReactvation('');
            setSpore(false);
            setMorphological('');
            setHost('');
            setIsolationMedium('')
            setStartIncubation(0);
            setCode('');
            setPigment('');

            uploadImages(id);
            getMorphological();
            alert('Cadastro realizado com sucesso!');
            history.push('/colecao-bacteriana');
        }
        catch(error){
            console.log(error);
            return
        }
    }

    function handleFileImage(e){
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setFilePhoto(image);
                setImageUrl(URL.createObjectURL(e.target.files[0]));
            }else {
                alert('Envie uma imagem do tipo PNG ou JPEG');
                setFilePhoto(null);
                return null;
            }
        }
    }

    function handleFileImageVerso(e){
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setFilePhotoVerso(image);
                setImageVersoUrl(URL.createObjectURL(e.target.files[0]));
            }else {
                alert('Envie uma imagem do tipo PNG ou JPEG');
                setFilePhotoVerso(null);
                return null;
            }
        }
    }

    function handleFileImageMicro(e){
        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setFilePhotoMicro(image);
                setImageMicroUrl(URL.createObjectURL(e.target.files[0]));
            }else {
                alert('Envie uma imagem do tipo PNG ou JPEG');
                setFilePhotoMicro(null);
                return null;
            }
        }
    }
    //continuar criando upload api
    async function handleUpload(idBactery){
        
        const currentUid = idBactery; 

        const body = new FormData();
        body.append('urlImagem', filePhotoMicro);
    
        try{
            api.defaults.headers.Authorization = `Bearer ${token}`;
            await api.patch(`/bacterias/${currentUid}/image`, body);
        }
        catch (error){
            console.log(error);
        }
    }

    async function uploadImages(idBactery){
        if(filePhotoMicro != null){
            handleUpload(idBactery);
        }
        return
    }

    async function editBactery(){
        let body = {
            codigo: code || props.location.codigo,
            identMolecular: molecularIdentification || props.location.identMolecular,
            cor: color || props.location.cor,
            consistence: consistence || props.location.consistence,
            detOpticos: detOpticos || props.location.detOpticos,
            pigmento: pigment || props.location.pigmento,
            forma: form || props.location.forma,
            borda: border || props.location.borda,
            superficie: surface || props.location.superficie, 
            elevacao: elevation || props.location.elevacao,
            esporula: spore || props.location.esporula,
            tipoCresc: typeGrowth || props.location.tipoCresc,
            propriedades: properties || props.location.propriedades,
            meioIsolamento: isolationMedium || props.location.meioIsolamento,
            tempIncubacao: startIncubation || props.location.tempIncubacao,
            descricaoIsolado: description || props.location.descricaoIsolado,
            dataColeta: dateCollect || props.location.dataColeta,
            dataReativacao: dateReactvation || props.location.dataReativacao,
            localColeta: collectionPlace || props.location.localColeta,
            morfologiaId: props.location.morfologiaId,
            hospedeiroId: props.location.hospedeiroId
        }

        try{
            api.defaults.headers.common.Authorization = 'Bearer ' + token;
            await api.patch(`/bacterias/${props.location.itemId}`, body);
            
            setFilePhoto('');
            setDescription('');
            setCollectionPlace('');
            setBorder('');
            setSurface('');
            setProperties('');
            setMolecularIdentification('');
            setTypeGrowth('');
            setColor('');
            setConsistence('');
            setDetOpticos('');
            setForm('');
            setElevation('');
            setDateCollect('');
            setDateReactvation('');
            setSpore(false);
            setMorphological('');
            setHost('');
            setIsolationMedium('')
            setStartIncubation(0);
            setCode('');
            setPigment('');
            
            handleUpload(props.location.itemId);
            getMorphological();
            alert('Registro atualizado com sucesso!');
            history.push('/colecao-bacteriana');
        }
        catch(error){
            console.log(error);
            alert('preencha todos os campos');
            return
        }
    }
    
    async function getMorphological(){
        try{
            let response = await api.get('/morfologias',{
                headers:{
                  'Content-type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'Accept': '*/*'
                }
              })
            const result = response.data;
            setDataMorphological(result.reverse());
        }
        catch(error){
            console.log('erro na listagem:', error);
        }
    }

    async function getHost(){
        try{
            let response = await api.get('/hospedeiros',{
                headers:{
                  'Content-type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'Accept': '*/*'
                }
              })
            const result = response.data;
            setDataHost(result.reverse());
        }
        catch(error){
            console.log('erro na listagem:', error);
        }
    }

    useEffect(()=> {
        function interationIdMorph(){
            setIdMorph(dataMorphological.filter(i => {
                return i.descricao === morphological;
            }));
        }
        interationIdMorph();
    }, [morphological]);

    useEffect(()=> {
        function interationIdHost(){
            setIdHost(dataHost.filter(i => {
                return i.descricao === host;
            }));
        }
        interationIdHost();
    }, [host]);

    useEffect(()=> {
        getMorphological();
    }, []);

    useEffect(()=> {
        getHost();
    }, []);

    async function getImages(){
        if(props.location.urlImagem === undefined){
            return;
        }else {
            try{
                let image;
                let response = await api.get(`/files/image?urlImage=${props.location.urlImagem}`, 
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
                let formatUrl = encodeURI(formatImage);
                setImageMicroUrl(formatUrl);
            }
            catch(error){
                alert('Ocorreu um erro na exibição de imagens');
                console.log(error);
            }
        }
        
    }

    useEffect(()=> {
        getImages();
    }, [updateTitle]);


    return (
        <div className='containerAddBacteryAll'>
            <Header title={title} visible={visible} offSearch={offSearch}/>
            <div onClick={()=> history.push("/colecao-bacteriana")} className='areaBackBactery'>
                <ArrowBackIosIcon className='backBactery'/>
            </div>
            <div className='areaFormAll'>
                <div className='areaFormBactery1'>
                <div className='smallAreaBacteryImage'>
                    <span>Adicionar foto: </span>
                    <label className="label-avatar">
                        <span>
                            <FiUpload color="#FFF" size={25} />
                        </span>

                        <input type="file" accept="image/*" onChange={handleFileImageMicro}  /><br/>
                        { imageMicroUrl === null ? 
                            <>
                                {updateTitle ?
                                    <CircularIndeterminate />
                                    :
                                    null
                                }
                                <AddPhotoAlternateIcon width="50" height="50"/>
                            </>
                            :
                            <img src={imageMicroUrl} width="50" height="50" alt="Microorganismo" />
                        }
                    </label>
                    {activeDeletePhotos ?
                        <span>Apagar foto: <FiXCircle onClick={()=> {
                            setImageMicroUrl(null);
                        }} color="#FFF" size={25}  cursor="pointer"/>
                        </span>
                        :
                        null
                    }
                    
                </div>
                    <div className='smallAreaBactery'>
                        <span>Código:</span>
                        <input type="text" placeholder='Digite um código' name="code" id="input" value={code || props.location.codigo} onChange={e=> setCode(e.target.value)}/>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Descrição do isolado:</span>
                        <select value={description || props.location.descricaoIsolado} name="description" id="input" onChange={e=> setDescription(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='ambiente'>ambiente</option>
                            <option value='plantas'>plantas</option>
                        </select>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Local de coleta:</span>
                            <input type="text" placeholder='Digite Cidade e Bairro' name="collectionPlace" id="input" value={collectionPlace || props.location.localColeta} onChange={e=> setCollectionPlace(e.target.value)}/>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Borda:</span>
                        <select value={border || props.location.borda} name="border" id="input" onChange={e=> setBorder(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='inteira'>inteira</option>
                            <option value='ondulada'>ondulada</option>
                            <option value='lobada'>lobada</option>
                            <option value='denteada'>denteada</option>
                            <option value='filamentos'>filamentos</option>
                        </select>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Tipo de crescimento:</span>
                        <select value={typeGrowth || props.location.tipoCresc} name="typeGrowth" id="input" onChange={e=> setTypeGrowth(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='limitado'>limitado</option>
                            <option value='invasivo'>invasivo</option>
                        </select>
                    </div>
                </div>
                <div className='areaFormBactery2'>
                    <div className='smallAreaBactery'>
                        <span>Cor:</span>
                        <input type="text" placeholder='Digite uma cor' name="color" id="input" value={color || props.location.cor} onChange={e=> setColor(e.target.value)}/>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Consistência:</span>
                        <select value={consistence || props.location.consistencia} name="color" id="input" onChange={e=> setConsistence(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='seca'>seca</option>
                            <option value='aquosa'>aquosa</option>
                            <option value='cremosa'>cremosa</option>
                            <option value='elastica'>elástica</option>
                            <option value='manteiga'>manteiga</option>
                        </select>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Detalhes Ópticos:</span>
                        <select value={detOpticos || props.location.detOpticos} name="color" id="input" onChange={e=> setDetOpticos(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='transparente'>transparente</option>
                            <option value='translucido'>translucido</option>
                            <option value='opaco'>opaco</option>
                        </select>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Forma:</span>
                        <select value={form || props.location.forma} name="form" id="input" onChange={e=> setForm(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='circular'>circular</option>
                            <option value='irregular'>irregular</option>
                            <option value='puntiforme'>puntiforme</option>
                            <option value='filamentoso'>filamentoso</option>
                        </select>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Elevação:</span>
                        <select value={elevation || props.location.elevacao} name="elevation" id="input" onChange={e=> setElevation(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='plana'>plana</option>
                            <option value='venticular'>venticular</option>
                            <option value='convexa'>convexa</option>
                            <option value='pulvinada'>pulvinada</option>
                            <option value='umbonada'>umbonada</option>
                            <option value='umbilicada'>umbilicada</option>
                        </select>
                    </div>
                    <div className='smallDateArea'>
                        <span>Data de Coleta:</span>
                        <input type="date" name="dateCollect" id="input" value={dateCollect || props.location.dataColeta} onChange={e=> setDateCollect(e.target.value)}/>
                        <span>Data de Reativação:</span>
                        <input type="date" name="dateReactvation" id="input" value={dateReactvation || props.location.dataReativacao} onChange={e=> setDateReactvation(e.target.value)}/>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Esporula:</span>
                        <select value={spore || props.location.esporula} name="spore" id="input" onChange={e=> setSpore(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value={true}>sim</option>
                            <option value={false}>não</option>
                        </select>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Superfície:</span>
                        <select value={surface || props.location.superficie} name="surface" id="input" onChange={e=> setSurface(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='lisa'>lisa</option>
                            <option value='rugosa'>rugosa</option>
                            <option value='cerebriforme'>cerebriforme</option>
                            <option value='coriacea'>coriacea</option>
                            <option value='algodonosa'>algodonosa</option>
                            <option value='cotonosa'>cotonosa</option>
                            <option value='mucoide'>mucoide</option>
                            <option value='cremosa'>cremosa</option>
                            <option value='concentrica'>concentrica</option>
                            <option value='opaca'>opaca</option>
                            <option value='aveludada'>aveludada</option>
                            <option value='brilhante'>brilhante</option>
                            <option value='pulverulenta'>pulverulenta</option>
                            <option value='sulcos'>sulcos</option>
                        </select>
                    </div>
                </div>
                <div className='areaFormBactery3'>
                    <div className='smallAreaAdd'>
                        <span>Identificação Morfológica:</span>
                        <div className='optionsMorphological'>
                            <select value={morphological || props.location.morfologia} name="morphological" id="input" onChange={e=> setMorphological(e.target.value)}>
                                <option value="">Selecionar</option>
                                {dataMorphological.map(i => (
                                    <option value={i.descricao}>{i.descricao}</option>
                                ))
                                }
                            </select>
                            <AddCircleIcon onClick={addMorphological} id='iconAdd' color='primary' />
                            {openAddMorph &&
                                <div className='addMorph'>
                                    <span>Cadastre uma identificação Morfológica</span>
                                    <input value={addMorph} type='text' id='addMorph' onChange={e=> setAddMoph(e.target.value)} />
                                    <div className='buttonsAddMorph'>
                                        <Stack spacing={5} direction="row">
                                            <Button onClick={addMorphRequest} size='small' variant="contained">CADASTRAR</Button>
                                        </Stack>
                                        <Stack spacing={5} direction="row">
                                            <Button onClick={()=> setOpenAddMorph(false)} size='small' variant="contained">CANCELAR</Button>
                                        </Stack>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='smallAreaAdd'>
                        <span>Origem do Hospedeiro:</span>
                        <div className='optionsMorphological'>
                            <select value={host || props.location.hospedeiro} name="host" id="input" onChange={e=> setHost(e.target.value)}>
                                <option value="">Selecione</option>
                                {dataHost.map(i => (
                                    <option value={i.descricao}>{i.descricao}</option>
                                ))
                                }
                            </select>
                            <AddCircleIcon onClick={addHost} id='iconAdd' color='primary' />
                            {openHost &&
                                <div className='addMorph'>
                                    <span>Cadastre uma origem do Hospedeiro</span>
                                    <input value={addNewHost} type='text' id='addMorph' onChange={e=> setAddNewHost(e.target.value)} />
                                    <div className='buttonsAddMorph'>
                                        <Stack spacing={5} direction="row">
                                            <Button onClick={addHostRequest} size='small' variant="contained">CADASTRAR</Button>
                                        </Stack>
                                        <Stack spacing={5} direction="row">
                                            <Button onClick={()=> setOpenHost(false)} size='small' variant="contained">CANCELAR</Button>
                                        </Stack>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Propriedades:</span>
                        <input type="text" placeholder='Digite uma propriedade' name="properties" id="input" value={properties || props.location.propriedades} onChange={e=> setProperties(e.target.value)}/>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Identificação Molecular:</span>
                        <input type="text" placeholder='Digite uma identificação' name="molecularIdentification" id="input" value={molecularIdentification || props.location.identMolecular} onChange={e=> setMolecularIdentification(e.target.value)}/>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Meio de Isolamento:</span>
                        <select value={isolationMedium || props.location.meioIsolamento} name="isolationMedium" id="input" onChange={e=> setIsolationMedium(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='bda'>bda</option>
                            <option value='tsb'>tsb</option>
                            <option value='sabouraud'>sabouraud</option>
                        </select>
                    </div>
                    <div className='smallNumberArea'>
                        <span>Dias de Incubação:</span>
                        <div className='areaDays'>
                            <input type="number" placeholder='Tempo' min={1} name="startIncubation" id="inputDays" value={startIncubation || props.location.tempIncubacao} onChange={e=> setStartIncubation(e.target.value)}/>
                            <span>Dias</span>
                        </div>
                    </div>
                    <div className='smallAreaBactery'>
                        <span>Pigmento:</span>
                        <input type="text" placeholder='Digite um pigmento' name="pigment" id="input" value={pigment || props.location.pigmento} onChange={e=> setPigment(e.target.value)}/>
                    </div>
                    <div style={{marginTop: 30}}>
                        {props.location.buttonUpdate ?
                            <Stack spacing={2} direction="row">
                                <Button onClick={editBactery} size='large' variant="contained">{updateTitle}</Button>
                            </Stack>
                            :
                            <Stack spacing={2} direction="row">
                                <Button onClick={addBactery} size='large' variant="contained">CADASTRAR</Button>
                            </Stack>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}