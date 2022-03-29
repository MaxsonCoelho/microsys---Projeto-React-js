import React, { useEffect, useState, useContext } from 'react';
import './addFungic.css';
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
import VersionApp from '../../components/VersionApp';



export default function AddFungic(props){
    let history = useHistory();
    const { token } = useContext(AuthContext);
    const [title, setTitle] = useState('CADASTRAR COLÔNIA FÚNGICA');
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
    const [urlImage, setUrlImage] = useState('');
    const [urlVerso, setUrlVerso] = useState('');
    const [urlMicro, setUrlMicro] = useState('');
    const [description, setDescription] = useState('');
    const [collectionPlace, setCollectionPlace] = useState('');
    const [border, setBorder] = useState('');
    const [surface, setSurface] = useState('');
    const [texture, setTexture] = useState('');
    const [properties, setProperties] = useState('');
    const [molecularIdentification, setMolecularIdentification] = useState('');
    const [typeGrowth, setTypeGrowth] = useState('');
    const [color, setColor] = useState('');
    const [backColor, setBackColor] = useState('');
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
    const [passValidation, setPassValidation] = useState(false);

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

    function validationFormFungic(body){
        const arrayBody = Object.entries(body);
        const propEmpty = arrayBody.filter(e => {
            return e[1] === '';
        })

        if(propEmpty.length > 0){
            const arrayPropEmpty = propEmpty.map(item => {
                return item[0];
            })

            const formatedString = arrayPropEmpty.join(', ').toString();
            alert(`Preencha os seguintes campos ${formatedString}`);
            setPassValidation(true);
        }
        
    }

    async function addFungic(){
        setPassValidation(false);
        
        if(imageUrl === undefined || imageVersoUrl === undefined || imageMicroUrl === undefined){
            return alert('Adicione todas as imagens para continuar o registro deste fungo.');
        }

        if(morphological === '' || host === ''){
            return alert('Escolha uma identificação Morfológica e uma Origem para o hospedeiro.');
        }

        const body = {
            codigo: code,
            identMolecular: molecularIdentification,
            cor: color,
            corVerso: backColor,
            pigmento: pigment,
            textura: texture,
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
            validationFormFungic(body);
        }else {
            return
        }
        
        try{
            api.defaults.headers.common.Authorization = 'Bearer ' + token;
            let response = await api.post('/fungos', body);

            const result = response.data;
            const id = result.id;
            setDescription('');
            setCollectionPlace('');
            setBorder('');
            setSurface('');
            setTexture('');
            setProperties('');
            setMolecularIdentification('');
            setTypeGrowth('');
            setColor('');
            setBackColor('');
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

            uploadImages(id);
            getMorphological();
            alert('Cadastro realizado com sucesso!');
            history.push('/colecao-fungica');
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
    async function handleUpload(idFungic){
        const currentUid = idFungic; 
        
        const body = new FormData();
        body.append('urlImagem', filePhoto || urlImage);
        body.append('urlImagemVerso', filePhotoVerso || urlVerso);
        body.append('urlImagemMicro', filePhotoMicro || urlMicro);
    
        try{
            api.defaults.headers.Authorization = `Bearer ${token}`;
            await api.patch(`/fungos/${currentUid}/images`, body);
        }
        catch (error){
            console.log(error);
        }
    }

    async function uploadImages(idFungic){
        if((filePhoto && filePhotoVerso && filePhotoMicro) !== null){
            handleUpload(idFungic);
        }
        return
    }

    async function editFungic(){
        let body = {
            codigo: code || props.location.codigo,
            identMolecular: molecularIdentification || props.location.identMolecular,
            cor: color || props.location.cor,
            corVerso: backColor || props.location.corVerso,
            pigmento: pigment || props.location.pigmento,
            textura: texture || props.location.textura,
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
            await api.patch(`/fungos/${props.location.itemId}`, body);
            
            setFilePhoto('');
            setDescription('');
            setCollectionPlace('');
            setBorder('');
            setSurface('');
            setTexture('');
            setProperties('');
            setMolecularIdentification('');
            setTypeGrowth('');
            setColor('');
            setBackColor('');
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
            history.push('/colecao-fungica');
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
                setUrlImage(formatUrl);
                
            }
            catch(error){
                alert('Ocorreu um erro na exibição de imagens');
                console.log(error);
            }
        }
        
        if(props.location.urlImagemVerso === undefined){
            return;
        }else {
            try{
                let image;
                let response = await api.get(`/files/image?urlImage=${props.location.urlImagemVerso}`, 
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
                setUrlVerso(formatUrl);
                
            }
            catch(error){
                alert('Ocorreu um erro na exibição de imagens');
                console.log(error);
            }
        }

        if(props.location.urlImagemMicro === undefined){
            return;
        }else {
            try{
                let image;
                let response = await api.get(`/files/image?urlImage=${props.location.urlImagemMicro}`, 
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
                setUrlMicro(formatUrl);
                
            }
            catch(error){
                alert('Ocorreu um erro na exibição de imagens');
                console.log(error);
            }
        }     
    }

    useEffect(()=> {
        getImages();
    }, [])

    return (
        <div className='containerAddFungicAll'>
            <Header title={title} visible={visible} offSearch={offSearch} dataFungic={props.location}/>
            <div onClick={()=> history.push("/colecao-fungica")} className='areaBackFungic'>
                <ArrowBackIosIcon className='backFungic'/>
            </div>
            <div className='areaFormAll'>
                <div className='areaFormFungic1'>
                <div className='smallAreaFungicImage'>
                    <span>Adicionar fotos:</span>
                    <label className="label-avatar">
                        <span>
                            <FiUpload color="#FFF" size={25} />
                        </span>

                        <input type="file" accept="image/*" onChange={handleFileImage}  /><br/>
                        { imageUrl === null && urlImage === '' ? 
                            <AddPhotoAlternateIcon width="50" height="50" />
                            :
                            <img src={imageUrl || urlImage} width="50" height="50" alt="Perspectiva" />
                        }
                    </label>
                    <label className="label-avatar">
                        <span>
                            <FiUpload color="#FFF" size={25} />
                        </span>

                        <input type="file" accept="image/*" onChange={handleFileImageVerso}  /><br/>
                        { imageVersoUrl === null && urlVerso === '' ? 
                            <AddPhotoAlternateIcon width="50" height="50" />
                            :
                            <img src={imageVersoUrl || urlVerso} width="50" height="50" alt="Verso" />
                        }
                    </label>
                    <label className="label-avatar">
                        <span>
                            <FiUpload color="#FFF" size={25} />
                        </span>

                        <input type="file" accept="image/*" onChange={handleFileImageMicro}  /><br/>
                        { imageMicroUrl === null && urlMicro === '' ? 
                            <AddPhotoAlternateIcon width="50" height="50" />
                            :
                            <img src={imageMicroUrl || urlMicro} width="50" height="50" alt="Microorganismo" />
                        }
                    </label>
                    <span>Apagar fotos: <FiXCircle onClick={()=> {
                        setImageUrl(null);
                        setImageVersoUrl(null);
                        setImageMicroUrl(null);
                    }} color="#FFF" size={25}  />
                    </span>
                </div>
                    <div className='smallAreaFungic'>
                        <span>Código:</span>
                        <input type="text" placeholder='Digite um código' name="code" id="input" value={code || props.location.codigo} onChange={e=> setCode(e.target.value)}/>
                    </div>
                    <div className='smallAreaFungic'>
                        <span>Descrição do isolado:</span>
                        <select value={description || props.location.descricaoIsolado} name="description" id="input" onChange={e=> setDescription(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='ambiente'>ambiente</option>
                            <option value='plantas'>plantas</option>
                        </select>
                    </div>
                    <div className='smallAreaFungic'>
                        <span>Local de coleta:</span>
                            <input type="text" placeholder='Digite Cidade e Bairro' name="collectionPlace" id="input" value={collectionPlace || props.location.localColeta} onChange={e=> setCollectionPlace(e.target.value)}/>
                    </div>
                    <div className='smallAreaFungic'>
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
                </div>
                <div className='areaFormFungic2'>
                    <div className='smallAreaFungic'>
                        <span>Tipo de crescimento:</span>
                        <select value={typeGrowth || props.location.tipoCresc} name="typeGrowth" id="input" onChange={e=> setTypeGrowth(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='limitado'>limitado</option>
                            <option value='invasivo'>invasivo</option>
                        </select>
                    </div>
                    <div className='smallAreaFungic'>
                        <span>Cor:</span>
                        <select value={color || props.location.cor} name="color" id="input" onChange={e=> setColor(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='verde'>verde</option>
                            <option value='branco'>branco</option>
                            <option value='branco/amarelo'>branco/amarelo</option>
                            <option value='branco/marrom'>branco/marrom</option>
                            <option value='branco/cinza'>branco/cinza</option>
                            <option value='branco/rosa'>branco/rosa</option>
                            <option value='amarelo'>amarelo</option>
                            <option value='laranja'>laranja</option>
                            <option value='rosa'>rosa</option>
                            <option value='lilas/roxo'>lilas/roxo</option>
                            <option value='bege'>bege</option>
                            <option value='marrom'>marrom</option>
                            <option value='preto'>preto</option>
                            <option value='cinza'>cinza</option>
                        </select>
                    </div>
                    <div className='smallAreaFungic'>
                        <span>Cor Verso:</span>
                        <select value={backColor || props.location.corVerso} name="backColor" id="input" onChange={e=> setBackColor(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='verde'>verde</option>
                            <option value='branco'>branco</option>
                            <option value='branco/amarelo'>branco/amarelo</option>
                            <option value='branco/marrom'>branco/marrom</option>
                            <option value='branco/cinza'>branco/cinza</option>
                            <option value='branco/rosa'>branco/rosa</option>
                            <option value='amarelo'>amarelo</option>
                            <option value='laranja'>laranja</option>
                            <option value='rosa'>rosa</option>
                            <option value='lilas/roxo'>lilas/roxo</option>
                            <option value='bege'>bege</option>
                            <option value='marrom'>marrom</option>
                            <option value='preto'>preto</option>
                            <option value='cinza'>cinza</option>
                        </select>
                    </div>
                    <div className='smallAreaFungic'>
                        <span>Forma:</span>
                        <select value={form || props.location.forma} name="form" id="input" onChange={e=> setForm(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='circular'>circular</option>
                            <option value='irregular'>irregular</option>
                            <option value='puntiforme'>puntiforme</option>
                            <option value='filamentoso'>filamentoso</option>
                        </select>
                    </div>
                    <div className='smallAreaFungic'>
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
                    <div className='smallAreaFungic'>
                        <span>Esporula:</span>
                        <select value={spore || props.location.esporula} name="spore" id="input" onChange={e=> setSpore(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value={true}>sim</option>
                            <option value={false}>não</option>
                        </select>
                    </div>
                    <div className='smallAreaFungic'>
                        <span>Textura:</span>
                        <select value={texture || props.location.textura} name="texture" id="input" onChange={e=> setTexture(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='leveduriforme'>leveduriforme</option>
                            <option value='rasteiro'>rasteiro</option>
                            <option value='fofo'>fofo</option>
                        </select>
                    </div>
                    <div className='smallAreaFungic'>
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
                            <option value='protuberância'>protuberância</option>
                        </select>
                    </div>
                </div>
                <div className='areaFormFungic3'>
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
                    <div className='smallAreaFungic'>
                        <span>Propriedades:</span>
                        <select value={properties || props.location.propriedades} name="properties" id="input" onChange={e=> setProperties(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='gramais'>gramais</option>
                            <option value='gramenos'>gramenos</option>
                            <option value='amilases'>amilases</option>
                            <option value='lipases'>lipases</option>
                            <option value='proteases'>proteases</option>
                            <option value='biosurfactantes'>biosurfactantes</option>
                            <option value='biorremediacao'>biorremediação</option>
                            <option value='controle'>controle</option>
                            <option value='inoculantes'>inoculantes</option>
                        </select>
                    </div>
                    <div className='smallAreaFungic'>
                        <span>Identificação Molecular:</span>
                        <input type="text" placeholder='Digite uma identificação' name="molecularIdentification" id="input" value={molecularIdentification || props.location.identMolecular} onChange={e=> setMolecularIdentification(e.target.value)}/>
                    </div>
                    <div className='smallAreaFungic'>
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
                    <div className='smallAreaFungic'>
                        <span>Pigmento:</span>
                        <select value={pigment || props.location.pigmento} name="pigment" id="input" onChange={e=> setPigment(e.target.value)}>
                            <option value="">Selecione</option>
                            <option value='amarelo'>amarelo</option>
                            <option value='vermelho'>vermelho</option>
                            <option value='laranja'>laranja</option>
                            <option value='lilas'>lilas</option>
                            <option value='verde'>verde</option>
                            <option value='azul'>azul</option>
                        </select>
                    </div>
                    <div style={{marginTop: 30}}>
                        {props.location.buttonUpdate ?
                            <Stack spacing={2} direction="row">
                                <Button onClick={editFungic} size='large' variant="contained">ATUALIZAR</Button>
                            </Stack>
                            :
                            <Stack spacing={2} direction="row">
                                <Button onClick={addFungic} size='large' variant="contained">CADASTRAR</Button>
                            </Stack>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}