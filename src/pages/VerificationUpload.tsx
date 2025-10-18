import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MatrixBackground from '@/components/MatrixBackground';
import { Code2, Upload, FileCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerificationUpload = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF or image file',
          variant: 'destructive',
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF or image file',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a certificate to upload',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // For now, we'll store a placeholder URL since storage buckets aren't set up yet
      // In production, you would upload to Supabase Storage first
      const supabaseAny = supabase as any;
      const { error } = await supabaseAny
        .from('verification_uploads')
        .insert({
          user_id: user.id,
          file_url: 'pending_upload', // Placeholder
          description: description || 'Verification certificate',
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your verification certificate has been submitted for review.',
      });

      // Clear form
      setFile(null);
      setDescription('');
      
      // Redirect to dashboard
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to submit verification',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  if (!user) return null;

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <MatrixBackground />
      
      <Card className="w-full max-w-2xl border-border bg-card/80 p-8 backdrop-blur-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="bg-gradient-primary bg-clip-text text-2xl font-bold text-transparent">
              Codifyr.co
            </span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-foreground">
            Get Verified
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload your coding certificate or GitHub proof to unlock all features
          </p>
        </div>

        <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Why verification?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Verification ensures quality collaboration and maintains a trusted community of coders.
                Upload certificates, GitHub stats, or portfolio screenshots.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file" className="text-foreground">
              Certificate / Proof (PDF or Image)
            </Label>
            <div
              className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : file
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border bg-card/50 hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Input
                id="file-input"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <FileCheck className="h-12 w-12 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, PNG, JPG (Max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="e.g., AWS Certified Developer Certificate, GitHub contributions screenshot..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-input resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 shadow-glow-md"
              disabled={loading || !file}
            >
              {loading ? 'Uploading...' : 'Submit for Verification'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Skip for Now
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          You can always upload verification later from your profile settings
        </p>
      </Card>
    </div>
  );
};

export default VerificationUpload;
