using ChineseDuck.Import.EfModels;
using Microsoft.EntityFrameworkCore;

namespace ChineseDuck.Import
{
    public partial class LearnChineseContext : DbContext
    {
        private readonly string _connectionString;

        public LearnChineseContext( string connectionString)
        {
            _connectionString = connectionString;
        }

        public virtual DbSet<Folder> Folder { get; set; }
        public virtual DbSet<FolderWord> FolderWord { get; set; }
        public virtual DbSet<Score> Score { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<UserSharing> UserSharing { get; set; }
        public virtual DbSet<Word> Word { get; set; }
        public virtual DbSet<WordFileA> WordFileA { get; set; }
        public virtual DbSet<WordFileO> WordFileO { get; set; }
        public virtual DbSet<WordFileP> WordFileP { get; set; }
        public virtual DbSet<WordFileT> WordFileT { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Folder>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(127);

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.Folder)
                    .HasForeignKey(d => d.IdUser)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Folder_User");
            });

            modelBuilder.Entity<FolderWord>(entity =>
            {
                entity.HasOne(d => d.IdFolderNavigation)
                    .WithMany(p => p.FolderWord)
                    .HasForeignKey(d => d.IdFolder)
                    .HasConstraintName("FK_FolderWord_Folder");

                entity.HasOne(d => d.IdWordNavigation)
                    .WithMany(p => p.FolderWord)
                    .HasForeignKey(d => d.IdWord)
                    .HasConstraintName("FK_FolderWord_Word");
            });

            modelBuilder.Entity<Score>(entity =>
            {
                entity.Property(e => e.LastLearnMode)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.LastLearned).HasColumnType("datetime");

                entity.Property(e => e.LastView).HasColumnType("datetime");

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.Score)
                    .HasForeignKey(d => d.IdUser)
                    .HasConstraintName("FK_Score_User");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.IdUser);

                entity.Property(e => e.IdUser).ValueGeneratedNever();

                entity.Property(e => e.JoinDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.LastCommand).HasMaxLength(50);

                entity.Property(e => e.Mode).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<UserSharing>(entity =>
            {
                entity.HasOne(d => d.IdFriendNavigation)
                    .WithMany(p => p.UserSharingIdFriendNavigation)
                    .HasForeignKey(d => d.IdFriend)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserSharing_UserFriend");

                entity.HasOne(d => d.IdOwnerNavigation)
                    .WithMany(p => p.UserSharingIdOwnerNavigation)
                    .HasForeignKey(d => d.IdOwner)
                    .HasConstraintName("FK_UserSharing_UserOwner");
            });

            modelBuilder.Entity<Word>(entity =>
            {
                entity.HasIndex(e => e.SyllablesCount);

                entity.Property(e => e.LastModified).HasColumnType("datetime");

                entity.Property(e => e.OriginalWord)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Pronunciation).HasMaxLength(100);

                entity.Property(e => e.SyllablesCount).HasDefaultValueSql("((1))");

                entity.Property(e => e.Translation)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.HasOne(d => d.IdOwnerNavigation)
                    .WithMany(p => p.Word)
                    .HasForeignKey(d => d.IdOwner)
                    .HasConstraintName("FK_Word_User");
            });

            modelBuilder.Entity<WordFileA>(entity =>
            {
                entity.HasKey(e => e.IdWord);

                entity.HasIndex(e => e.Id)
                    .HasName("UQ__WordFile__3214EC066B2DF97D")
                    .IsUnique();

                entity.Property(e => e.IdWord).ValueGeneratedNever();

                entity.Property(e => e.Bytes).IsRequired();

                entity.Property(e => e.CreateDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.IdWordNavigation)
                    .WithOne(p => p.WordFileA)
                    .HasForeignKey<WordFileA>(d => d.IdWord)
                    .HasConstraintName("FK_WordFileA_WordMain");
            });

            modelBuilder.Entity<WordFileO>(entity =>
            {
                entity.HasKey(e => e.IdWord);

                entity.HasIndex(e => e.Id)
                    .HasName("UQ__WordFile__3214EC06FC545398")
                    .IsUnique();

                entity.Property(e => e.IdWord).ValueGeneratedNever();

                entity.Property(e => e.Bytes).IsRequired();

                entity.Property(e => e.CreateDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.IdWordNavigation)
                    .WithOne(p => p.WordFileO)
                    .HasForeignKey<WordFileO>(d => d.IdWord)
                    .HasConstraintName("FK_WordFileO_WordMain");
            });

            modelBuilder.Entity<WordFileP>(entity =>
            {
                entity.HasKey(e => e.IdWord);

                entity.HasIndex(e => e.Id)
                    .HasName("UQ__WordFile__3214EC06B7564817")
                    .IsUnique();

                entity.Property(e => e.IdWord).ValueGeneratedNever();

                entity.Property(e => e.Bytes).IsRequired();

                entity.Property(e => e.CreateDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.IdWordNavigation)
                    .WithOne(p => p.WordFileP)
                    .HasForeignKey<WordFileP>(d => d.IdWord)
                    .HasConstraintName("FK_WordFileP_WordMain");
            });

            modelBuilder.Entity<WordFileT>(entity =>
            {
                entity.HasKey(e => e.IdWord);

                entity.HasIndex(e => e.Id)
                    .HasName("UQ__WordFile__3214EC064594EC3E")
                    .IsUnique();

                entity.Property(e => e.IdWord).ValueGeneratedNever();

                entity.Property(e => e.Bytes).IsRequired();

                entity.Property(e => e.CreateDate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.IdWordNavigation)
                    .WithOne(p => p.WordFileT)
                    .HasForeignKey<WordFileT>(d => d.IdWord)
                    .HasConstraintName("FK_WordFileT_WordMain");
            });
        }
    }
}
