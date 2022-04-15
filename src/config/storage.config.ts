import { join } from 'path';
import * as multer from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

/* storage users  */
const storageUsers = multer.diskStorage({
    
  destination: ( request, file, callback ) => {
      const route = join( process.cwd(), 'public', 'static', 'uploads', 'users' );
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

export const CONFIG_STORAGE_USERS: MulterOptions = {
  storage: storageUsers,
  limits: { fileSize: 1e6 },
  fileFilter: ( request, file, callback ) => {
    
    // white list of extentions
    const extentions = ['image/png', 'image/jpeg', 'image/jpg'];
    
    callback( null, extentions.includes( file.mimetype ));
  },
};