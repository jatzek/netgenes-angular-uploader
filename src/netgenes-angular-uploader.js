/**
 * Created by jacek on 01.06.16.
 */

( function ( angular ) {

    angular
        .module('netgenes.$ngUploader',[])
        .service('$ngUploader', function () {

            function Upload( conf ) {

                this.config = {};

                var defaults = {

                    multipleFiles: false,

                    acceptFiles : null,

                    url : null,

                    additionalData: {},
                    fileFieldName: 'file',
                    responseType: 'json',
                    headers: {},

                    onSuccess : angular.noop,
                    onError: angular.noop,
                    onProgress: angular.noop
                };

                Object.assign( this.config, defaults, conf );

                if (this.config.url === null) {

                    throw new Error('Upload Endpoint url must be specified!');
                }

                var successCallback = function ( event ) {

                    document.body.removeChild( handlerInput );
                    this.config.onSuccess( event );

                }.bind( this );

                var errorCallback = function ( event ) {

                    document.body.removeChild( handlerInput );
                    this.config.onError( event );

                }.bind( this );

                var progressCallback = function ( event ) {

                    this.config.onProgress( event );

                }.bind( this );

                var changeHandler = function ( changeEvent ) {

                    var files,
                        xhr,
                        formData,
                        additionalData,
                        fileFieldName,
                        responseType,
                        endpointUrl,
                        requestHeaders;

                    if ( 0 === event.target.files.length )
                        return;

                    files = event.target.files;

                    additionalData = this.config.additionalData;
                    fileFieldName = this.config.fileFieldName;
                    responseType = this.config.responseType;
                    endpointUrl = this.config.url;
                    requestHeaders = this.config.headers;

                    formData = new FormData();

                    for ( var p in additionalData ) {

                        if ( !additionalData.hasOwnProperty( p ))
                            continue;

                        formData.append(p,additionalData[p]);
                    }

                    for ( var i in files ) {

                        if ( !files.hasOwnProperty( i ))
                            continue;

                        formData.append( fileFieldName, files[ i ] );
                    }

                    xhr = new XMLHttpRequest();
                    xhr.responseType = responseType;

                    xhr.addEventListener('load', successCallback );
                    xhr.addEventListener('error', errorCallback );
                    xhr.upload.addEventListener('progress', progressCallback );

                    xhr.open('POST', endpointUrl );

                    for ( var h in requestHeaders ) {

                        if ( !requestHeaders.hasOwnProperty( h ))
                            continue;

                        xhr.setRequestHeader( h, requestHeaders[ h ]);
                    }

                    xhr.send( formData );

                }.bind( this );


                var handlerInput = document.createElement('input');
                handlerInput.setAttribute( 'type', 'file' );
                handlerInput.style.display = 'none';
                handlerInput.addEventListener('change', changeHandler );

                if ( this.config.acceptFiles ) {

                    handlerInput.setAttribute('accept', this.config.acceptFiles );
                }

                if ( this.config.multipleFiles ) {

                    handlerInput.setAttribute('multiple', true );
                }

                document.body.appendChild( handlerInput );

                var click = document.createEvent('MouseEvents');
                click.initEvent('click', true, true );
                click.synthetic = true;

                handlerInput.dispatchEvent( click );
            }

            function NgUploader() { }

            NgUploader.prototype.upload = function( config ) {

                return new Upload( config );
            };

            return new NgUploader();
        });
    
})( angular );