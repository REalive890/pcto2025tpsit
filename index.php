<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Reviews</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="public/CSS/style.css" rel="stylesheet">
    
</head>

<body>
    <div id="page-container" class="d-flex flex-column min-vh-100">
        <nav class="navbar navbar-expand-lg">
            <div class="container">
                <a id="home" class="navbar-brand fw-bold" href="#">Game & Reviews</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a id="loginBtn" class="nav-link active" aria-current="page" href="#">Login</a>
                        </li>
                        <li class="nav-item">
                            <a id="registerBtn" class="nav-link" href="#">Register</a>
                        </li>
                        <li class="nav-item">
                            <a id="logoutBtn" class="nav-link" href="#">Logout</a>
                        </li>
                    </ul>
                    <span class="ms-auto navbar-text" id="loginStatus"></span>
                </div>
            </div>
        </nav>
        <!-- Content wrapper -->
        <div id="content-wrap" class="flex-grow-1">
            <div id="app"></div>
        </div>
        <!-- Content Wrap end -->
        <footer class="footer text-center mt-auto">
            <div class="container">
                &copy; <?php echo date("Y"); ?> Game Reviews - All rights reserved.
            </div>
        </footer>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    <script src="public/JS/utilities.js?v=1.0"></script>
    <script src="public/JS/user.js?v=1.0"></script>
    <script src="public/JS/games.js?v=1.0"></script>
    <script src="public/JS/reviews.js?v=1.0"></script>
    <script src="public/JS/script.js?v=1.0"></script>
</body>

</html>