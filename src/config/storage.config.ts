import { join } from 'path';
import * as multer from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const storage = multer.diskStorage({
    
    destination: ( request, file, callback ) => {
        const route = join( process.cwd(), 'public', 'static', 'uploads' );
        callback( null, route );
    },
    
    filename: ( request, file, callback ) => {
        
        const uniqueSuffix = Date.now() + '-' + Math.round( Math.random() * 1e9 )
        let name = file.fieldname + '-' + uniqueSuffix;
  
        switch ( file.mimetype ) {
            
            case 'image/png':
                name += '.png';
                break;
  
            case 'image/jpeg':
                name += '.jpeg';
                break;
  
            default:
                name += '.jpg';
                break;
        }
  
        callback( null, name );
    },
  });

  export const CONFIG_STORAGE: MulterOptions = {
      storage,
      limits: { fileSize: 1e6 }
  };