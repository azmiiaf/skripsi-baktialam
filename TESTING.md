# untuk akses sistem 

## Admin
- email: [admin@baktialam.com]
- password: [admin123]

## Nasabah
- email: [m.azmialfadillah@gmail.com]
- password: [azmi111]


# Pengujian Fungsional Sistem

  -----------------------------------------------------------------------------------------
  No         Fungsi       Skenario Uji  Input         Output yang    Hasil       Status
                                                      Diharapkan     Pengujian   
  ---------- ------------ ------------- ------------- -------------- ----------- ----------
  1          Login        Login dengan  Email dan     Sistem                     
                          data valid    password      mengarahkan                
                                        terdaftar     pengguna ke                
                                                      dashboard                  
                                                      sesuai peran               
                                                      (admin atau                
                                                      nasabah)                   

  2          Login        Login dengan  Email yang    Sistem                     
                          email tidak   tidak         menampilkan                
                          terdaftar     terdaftar     pesan bahwa                
                                                      akun tidak                 
                                                      ditemukan                  

  3          Login        Login dengan  Email         Sistem                     
                          password      terdaftar dan menampilkan                
                          salah         password yang pesan bahwa                
                                        salah         password tidak             
                                                      sesuai                     

  4          Register     Register      Nama, email   Akun berhasil              
                          dengan data   baru,         dibuat dan                 
                          lengkap dan   wilayah,      dapat                      
                          valid         password, dan digunakan                  
                                        konfirmasi    untuk login                
                                        password                                 

  5          Register     Register      Email yang    Sistem                     
                          dengan email  sudah         menampilkan                
                          yang sudah    digunakan     pesan bahwa                
                          terdaftar                   email sudah                
                                                      digunakan                  

  6          Register     Register      Password dan  Sistem                     
                          dengan        konfirmasi    menampilkan                
                          password      password      pesan bahwa                
                          tidak sesuai  berbeda       konfirmasi                 
                          konfirmasi                  password tidak             
                                                      cocok                      

  7          Reset        Mengirim      Email yang    Sistem                     
             Password     permintaan    terdaftar di  mengirim                   
                          reset         sistem        tautan reset               
                          password                    password ke                
                                                      email pengguna             

  8          Reset        Mengubah      Password baru Password                   
             Password     password baru dan           berhasil                   
                                        konfirmasi    diperbarui dan             
                                        password yang pengguna                   
                                        sesuai        diarahkan ke               
                                                      halaman login              

  9          Kelola       Menambahkan   Nama,         Data nasabah               
             Nasabah      data nasabah  wilayah,      berhasil                   
                          baru          email, dan    disimpan dan               
                                        password      tampil pada                
                                                      daftar nasabah             

  10         Kelola       Mengubah data Data nasabah  Perubahan data             
             Nasabah      nasabah       yang          berhasil                   
                                        diperbarui    disimpan                   

  11         Kelola       Menghapus     Konfirmasi    Data nasabah               
             Nasabah      data nasabah  penghapusan   terhapus dari              
                                                      sistem                     

  12         Kelola       Mencari data  Kata kunci    Sistem                     
             Nasabah      nasabah       nama nasabah  menampilkan                
                                                      data nasabah               
                                                      yang sesuai                
                                                      dengan kata                
                                                      kunci                      

  13         Kelola       Menambahkan   Nasabah,      Data setoran               
             Setoran      data setoran  tanggal,      tersimpan dan              
                                        jenis sampah, total                      
                                        dan berat     pendapatan                 
                                                      dihitung                   
                                                      secara                     
                                                      otomatis                   

  14         Kelola       Mengubah data Data setoran  Perubahan data             
             Setoran      setoran       yang          setoran                    
                                        diperbarui    berhasil                   
                                                      disimpan                   

  15         Kelola       Menghapus     Konfirmasi    Data setoran               
             Setoran      data setoran  penghapusan   terhapus dari              
                                                      sistem                     

  16         Ranking      Melihat hasil Membuka       Sistem                     
             Admin        ranking       halaman       menampilkan                
                          nasabah       ranking       daftar                     
                                                      peringkat                  
                                                      nasabah                    
                                                      berdasarkan                
                                                      hasil                      
                                                      perhitungan                

  17         Laporan      Melihat       Membuka       Sistem                     
                          laporan       halaman       menampilkan                
                          bulanan       laporan       rekapitulasi               
                                                      data                       
                                                      berdasarkan                
                                                      periode                    
                                                      bulanan                    

  18         Laporan      Mengekspor    Menekan       File laporan               
                          laporan ke    tombol Export dalam format               
                          Excel         Excel         .xlsx berhasil             
                                                      diunduh                    

  19         Dashboard    Melihat       Login sebagai Sistem                     
             Nasabah      ringkasan     nasabah       menampilkan                
                          data pribadi                informasi                  
                                                      saldo, total               
                                                      setoran, total             
                                                      berat sampah,              
                                                      dan grafik                 

  20         Riwayat      Melihat       Membuka       Sistem                     
             Setoran      riwayat       halaman       menampilkan                
                          setoran       Riwayat       daftar riwayat             
                                        Setoran       setoran milik              
                                                      nasabah yang               
                                                      sedang login               

  21         Notifikasi   Menerima      Admin         Sistem                     
                          notifikasi    menambahkan   menampilkan                
                          setoran baru  data setoran  notifikasi                 
                                                      kepada nasabah             
                                                      terkait                    
                                                      setoran baru               

  22         Ranking      Melihat papan Membuka       Sistem                     
             Nasabah      peringkat     halaman       menampilkan                
                                        ranking       daftar                     
                                                      peringkat                  
                                                      nasabah                    

  23         Logout       Keluar dari   Menekan       Sistem                     
                          sistem        tombol Keluar mengakhiri                 
                                                      sesi pengguna              
                                                      dan                        
                                                      mengarahkan ke             
                                                      halaman login              
  -----------------------------------------------------------------------------------------



# uji akurasi algoritma vikor