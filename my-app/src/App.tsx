import React from "react"
import './App.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { ReactSVG } from 'react-svg';
import { css } from 'glamor';

// Styles 
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
      '& > * + *': {
        marginTop: theme.spacing(2)
      }
    },
    imgBox: {
      display: 'inline-flex',
      justifyContent: 'center',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '600px',
      height: 'auto'
    }
  })
);

// Alerts toast notifications
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Main functional component
function App() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState("")
  const [opacity, setOpacity] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [zoom, setZoom] = React.useState(0)

  // Close notification
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // Define sliders text values 
  function valuetext(value: number) {
    return `${value}`;
  }

  // Get uploaded image and display toast notificacion
  function useDisplayImage() {
    const [result, setResult] = React.useState("");

    function uploader(e: any) {
      if (e.target.files && e.target.files.length > 0) {
        // Create file reader and set result from target
        const reader = new FileReader();
        reader.addEventListener("load", (e: any) => {
          setResult(e.target.result);
        });

        reader.readAsDataURL(e.target.files[0]);

        // Open success notificacion
        setOpen(true);
      }
    }

    return { result, uploader };
  }

  const { result, uploader } = useDisplayImage();

  // Set SVG styles -- opactiy, rotation and zoom are dynamically changed with sliders
  const styles = css({
    ' svg': {
      width: 600,
      opacity: opacity,
      transform: `rotate(${rotation}deg) scale(1.${zoom})`
    },
  })

  // Check when file is full loaded in order to get its element properties
  function handleImageLoaded() {
    const element = document.getElementsByClassName('svg-class-name');

    if (element) {
      // Get bounding box from uploaded SVG file
      let bBox = element[0].getBoundingClientRect();
    }
  }

  // Return App
  return (
    <div className="App">
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          File uploaded correctly!
        </Alert>
      </Snackbar>
      <header className="App-header">
        <h3>
          SVG File Editor
        </h3>
        <Button
          variant="contained"
          component="label"
          color="primary"
        >
          Upload SVG file
          <input type="file" hidden name="file" onChange={(e: any) => {
            setImageSrc(e.target.files[0]);
            uploader(e);
          }} />
        </Button>
        <div className={classes.root}>
          <Grid container>
            {/* Default */}
            <Grid item xs={5}>
              {result &&
                <h4>Default view</h4>
              }
              {result && <img
                src={result}
                alt=""
                width="600"
              />
              }
            </Grid>
            <Grid item xs={2}>
              {/* Zoom slider */}
              {result &&
                <h4>Zoom</h4>
              }
              {result &&
                <Slider
                  value={zoom}
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider-custom"
                  valueLabelDisplay="auto"
                  min={0}
                  max={9}
                  step={1}
                  onChange={(e, zoom) => setZoom(Number(zoom))}
                />
              }
              {/* Rotation slider */}
              {result &&
                <h4>Rotation</h4>
              }
              {result &&
                <Slider
                  value={rotation}
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider-custom"
                  valueLabelDisplay="auto"
                  min={0}
                  max={360}
                  step={1}
                  onChange={(e, rotation) => setRotation(Number(rotation))}
                />
              }
              {/* Opacity slider */}
              {result &&
                <h4>Opacity</h4>
              }
              {result &&
                <Slider
                  value={opacity}
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider-custom"
                  valueLabelDisplay="auto"
                  defaultValue={1}
                  min={0}
                  step={0.1}
                  max={1}
                  onChange={(e, opacity) => setOpacity(Number(opacity))}
                />
              }
            </Grid>
            {/* Preview */}

            <React.Fragment>
              <Grid item xs={5} >
                {result &&
                  <h4>Preview view</h4>
                }
                {result &&
                  <div className={classes.imgBox}>
                    <ReactSVG
                      src={result}
                      {...styles}
                      afterInjection={(error, svg) => {
                        if (error) {
                          console.error(error)
                          return
                        }
                        handleImageLoaded()
                      }}
                      beforeInjection={(svg) => {
                        svg.classList.add('svg-class-name')
                        svg.setAttribute('style', 'height: unset')
                      }}
                    />
                  </div>
                }
              </Grid>
            </React.Fragment>
          </Grid>
        </div>
      </header>
    </div >
  );
}

export default App

