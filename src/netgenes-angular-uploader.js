/**
 * Created by jacek on 01.06.16.
 */

( function ( angular ) {

    angular
        .module('netgenes.$ngUploader',[])
        .factory('$ngFileChooser', function () {

            function NgFileChooser( ) { }

            NgFileChooser.prototype = {

                defaults : {

                    multiple : false,
                    accept : null,
                    callback : angular.noop
                },
                open: function ( providedConfig ) {

                    var defaults = this.defaults;

                    return new Promise( function ( resolve ) {

                        var fileInput,
                            config,
                            clickEvent,
                            changeHandler,
                            promise;

                        changeHandler = function ( changeEvent ) {

                            var files;

                            files = changeEvent.target.files;

                            config.callback( files );

                            document.body.removeChild( fileInput );

                            resolve( files );

                        }.bind( this );


                        config = Object.assign( {} , defaults , providedConfig );

                        fileInput = document.createElement('input');
                        fileInput.setAttribute('type', 'file');
                        fileInput.addEventListener('change', changeHandler );

                        if ( config.multiple ) {

                            fileInput.setAttribute('multiple', true );
                        }

                        if ( config.accept ) {

                            fileInput.setAttribute('accept', config.accept );
                        }

                        clickEvent = document.createEvent('MouseEvents');
                        clickEvent.initEvent('click', true, true );
                        clickEvent.synthetic = true;

                        document.body.appendChild( fileInput );

                        fileInput.dispatchEvent( clickEvent );
                    });
                }
            };

            return new NgFileChooser();
        })
        .service('$ngUploader', function ( $ngFileChooser ) {

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

                    this.config.onSuccess( event );

                }.bind( this );

                var errorCallback = function ( event ) {

                    this.config.onError( event );

                }.bind( this );

                var progressCallback = function ( event ) {

                    this.config.onProgress( event );

                }.bind( this );



                var openHandler = function ( files ) {

                    var xhr,
                        formData,
                        additionalData,
                        fileFieldName,
                        responseType,
                        endpointUrl,
                        requestHeaders;

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

                $ngFileChooser
                    .open( {
                        accept : this.config.acceptFiles,
                        multiple : this.config.multipleFiles
                    })
                    .then( openHandler );
            }

            function NgUploader() { }

            NgUploader.prototype.upload = function( config ) {

                return new Upload( config );
            };

            return new NgUploader();
        });
    
})( angular );