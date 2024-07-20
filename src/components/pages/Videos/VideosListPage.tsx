import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Container,
  Tooltip,
  Alert,
  AlertTitle,
  Stack,
  TablePagination,
  Box,
  Backdrop,
  CircularProgress,
} from '@mui/material';

import { videoServices } from '../../../services/videos/videos';
import { CreateVideos, Videos, UpdateVideos } from '../../types/videos';
import { textAlign } from '@mui/system';

const VideoList = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [videos, setVideos] = useState<Videos[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Videos | null>(null);
  const [urlVideo, setUrlVideo] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const closeSuccessMessage = () => {
    setTimeout(() => {
      setSuccessMessage('');
    }, 10000); // 10000 milisegundos = 10 segundos
  };

  useEffect(() => {
    if (successMessage) {
      closeSuccessMessage();
    }
    const fetchVideos = async () => {
      try {
        const response = await videoServices.getAllVideos('');
        setVideos(response);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const openModal = (videoId: string, video: Videos | null = null) => {
    const selectedVideoData = videos.find((r) => r._id === videoId);

    if (selectedVideoData) {
      setSelectedVideo(selectedVideoData);
      setTitle(selectedVideoData.title);
      setDescription(selectedVideoData.description);
      setUrlVideo(selectedVideoData.urlVideo);
    } else {
      clearInputFields();
    }
    setModalOpen(true);
  };

  const handleAddVideo = async () => {
    const newVideo: CreateVideos = {
      title,
      description,
      urlVideo
    };

    try {
      await videoServices.createVideo(newVideo, ''); // Crear el video en el backend
      const updatedVideos = await videoServices.getAllVideos('');
      setVideos(updatedVideos);
      clearInputFields();
      closeModal();
      setAction('AGREGADO');
      setSuccessOpen(true);
      setSuccessMessage('Video agregado correctamente');
    } catch (error) {
      console.error('Error al agregar el video:', error);
    }
  };

  const handleUpdateVideo = async () => {
    if (selectedVideo) {
      setUpdating(true); // Mostrar fondo oscuro y el indicador de carga

      const updatedVideo: UpdateVideos = {
        _id: selectedVideo._id,
        urlVideo,
        title,
        description,
      };

      try {
        await videoServices.updateById(selectedVideo._id, updatedVideo, ''); // Actualizar la video en el backend
        const updatedVideos = videos.map((video) =>
          video._id === selectedVideo._id ? { ...video, urlVideo, title, description } : video
        );

        setVideos(updatedVideos);
        clearInputFields();
        closeModal();
        setAction('ACTUALIZADO');
        setSuccessOpen(true);
        setSuccessMessage('Video actualizado correctamente');
        setUpdating(false); // Ocultar fondo oscuro y el indicador de carga después de completar la actualización
        setConfirmOpen(false); // Aquí se cierra la modal de confirmación después de eliminar la video
      } catch (error) {
        console.error('Error al actualizar el video:', error);
      }
    }
  };

  const handleDeleteVideo = async () => {
    if (selectedVideo) {
      try {
        await videoServices.deleteVideo(selectedVideo._id, '');
        const updatedVideos = videos.filter((video) => video._id !== selectedVideo._id);

        setVideos(updatedVideos);
        clearInputFields();
        closeModal();
        setAction('ELIMINADO');
        setSuccessOpen(true);
        setSuccessMessage('Video eliminado correctamente');
        setConfirmOpen(false); // Aquí se cierra la modal de confirmación después de eliminar el video
      } catch (error) {
        console.error('Error al eliminar el video:', error);
      }
    }
  };

  const closeModal = () => {
    clearInputFields();
    setModalOpen(false);
    setSuccessOpen(false);
  };

  const clearInputFields = () => {
    setTitle('');
    setDescription('');
    setUrlVideo('');
    setSelectedVideo(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const normalizeString = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const filteredVideos = videos.filter((video) =>
    normalizeString(video.title).toLowerCase().includes(normalizeString(searchTerm).toLowerCase())
  );

  // Función para extraer el ID del video de YouTube desde la URL
  const extractYouTubeVideoId = (url: string) => {
    const regExp =
      /^(?:(?:https?):\/\/)?(?:www.)?(?:youtube.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);

    if (match && match[1]) {
      return match[1];
    } else {
      return ''; // Manejo de errores si la URL no es válida o no contiene un ID de video de YouTube válido
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Backdrop open={updating}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <br />
      <br />
      {successMessage && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert
            severity="success"
            onClose={() => {
              setSuccessMessage('');
            }}
          >
            <AlertTitle>{action}</AlertTitle>
            {successMessage}
          </Alert>
        </Stack>
      )}
      <Typography variant="h3" align="justify">
        LISTADO DE VIDEOS
      </Typography>
      <Tooltip title="Buscar por nombre">
        <TextField
          label="Buscar"
          variant="outlined"
          margin="normal"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />
      </Tooltip>
      <br />
      <br />
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 700 }}>NOMBRE</TableCell>
              <TableCell style={{ fontWeight: 700 }}>DESCRIPCIÓN</TableCell>
              <TableCell style={{ fontWeight: 700 }}>VISTA PREVIA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVideos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((video) => (
              <TableRow
                key={video._id}
                onClick={() => openModal(video._id, video)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'inherit')}
              >
                {/* <TableCell>{video.title}</TableCell>
                <TableCell>{video.description}</TableCell>
                <TableCell>
                  {video.urlVideo && (
                    <iframe
                      width="100%"
                      height="20%"
                      src={`https://www.youtube.com/embed/${extractYouTubeVideoId(video.urlVideo)}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Embedded youtube"
                      style={{ borderRadius: '10%' }}
                    ></iframe>
                  )}
                </TableCell> */}
                 <TableCell>{video.title}</TableCell>
                <TableCell style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {video.description}
                </TableCell>
                <TableCell>
                  {video.urlVideo && (
                    <iframe
                      width="100%"
                      height="50%"
                      src={`https://www.youtube.com/embed/${extractYouTubeVideoId(video.urlVideo)}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Embedded youtube"
                      style={{ borderRadius: '3%' }}
                    ></iframe>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredVideos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>{selectedVideo ? 'Editar Video' : 'Agregar Video'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Nombre"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Descripción"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Link del video"
            variant="outlined"
            fullWidth
            value={urlVideo}
            onChange={(e) => setUrlVideo(e.target.value)}
          />
          {/* Mostrar vista previa del video de YouTube */}
          {urlVideo && (
            <Box mt={2}>
              <Typography variant="body2">Vista previa del video:</Typography>
              <br/>
              <Box width="100%" >
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${extractYouTubeVideoId(urlVideo)}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                  style={{ borderRadius: '3%', textAlign:'center' }}
                ></iframe>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedVideo && (
            <Button onClick={() => setConfirmOpen(true)} variant="contained" color="error">
              Eliminar
            </Button>
          )}
          <Button onClick={closeModal} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button
            onClick={selectedVideo ? handleUpdateVideo : handleAddVideo}
            variant="contained"
            color="primary"
            disabled={!title || !description}
          >
            {selectedVideo ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Está seguro de que desea eliminar este video?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteVideo} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Button onClick={() => openModal('', null)} variant="contained" color="primary">
        Agregar Video
      </Button>
    </Container>
  );
};

export default VideoList;